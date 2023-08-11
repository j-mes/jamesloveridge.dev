const nunjucks = require('nunjucks');
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

			return [...prev, [year, filteredPosts]];
		}, []);

		return postsByYear;
	});

	config.addPassthroughCopy('./src/images');
	config.addPassthroughCopy('./src/main.css');
	config.addPassthroughCopy('./CNAME');

	config.addPlugin(pluginRss);

	return {
		dir: {
			input: './src',
			output: './_site',
		},
		passthroughFileCopy: true,
	};
};
