const nunjucks = require('nunjucks');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postCssCsso = require('postcss-csso');
const postCssImport = require('postcss-import');
const inclusiveLanguage = require('@11ty/eleventy-plugin-inclusive-language');
const pluginRss = require('@11ty/eleventy-plugin-rss');

const utils = './src/_includes/utils';
const blocks = './src/_includes/blocks';
const siteName = require(`${utils}/site-name`);

module.exports = (config) => {
	const nunjucksEnv = new nunjucks.Environment(
		new nunjucks.FileSystemLoader('./src/_includes'),
	);
	config.setLibrary('njk', nunjucksEnv);
	config.addNunjucksShortcode('siteName', siteName);

	config.addTemplateFormats('css');

	// compile css on the fly
	config.addExtension('css', {
		outputFileExtension: 'css',
		compile: async (inputContent, inputPath) => {
			if (inputPath !== './src/css/main.css') {
				return;
			}

			return async () => {
				let main = await postcss([
					postCssImport,
					autoprefixer,
					postCssCsso,
				]).process(inputContent, { from: inputPath });

				return main.css;
			};
		},
	});

	config.addPlugin(inclusiveLanguage, {
		templateFormats: ['md'],
		words:
			'simply,obviously,basically,of course,clearly,just,everyone knows,however,easy',
	});

	// group intermittent notes by years
	config.addCollection('postsByYear', (collection) => {
		const posts = collection.getFilteredByTag('notes').reverse();
		const years = posts.map((post) => post.date.getFullYear());
		const uniqueYears = [...new Set(years)];

		const postsByYear = uniqueYears.reduce((prev, year) => {
			const filteredPosts = posts.filter(
				(post) => post.date.getFullYear() === year,
			);

			return [...prev, [year, filteredPosts.reverse()]];
		}, []);

		return postsByYear;
	});

	config.addPassthroughCopy('./src/images');
	config.addPassthroughCopy('./src/CNAME');

	config.addPlugin(pluginRss);

	return {
		dir: {
			input: './src',
			output: './_site',
		},
		passthroughFileCopy: true,
	};
};
