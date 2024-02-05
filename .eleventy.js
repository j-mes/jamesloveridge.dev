const nunjucks = require('nunjucks');
const inclusiveLanguage = require('@11ty/eleventy-plugin-inclusive-language');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const notInclusiveWords = require('./src/_11ty/helpers/not-inclusive-words');
const truncateWords = require('./src/_11ty/helpers/truncate-words');
const cssSettings = require('./src/_11ty/helpers/css-settings');

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
	config.addExtension('css', cssSettings);

	// Eleventy filters
	config.addFilter('truncatewords', truncateWords);

	// Eleventy Pass Throughs
	config.addPassthroughCopy('./src/images');
	config.addPassthroughCopy('./src/CNAME');

	// Eleventy plugins
	config.addPlugin(inclusiveLanguage, {
		templateFormats: ['md'],
		words: notInclusiveWords,
	});
	config.addPlugin(pluginRss);

	// TODO: Make the following two 'addCollections' to be scalable
	// and not so brittle like below. 🤦

	// group intermittent notes by years
	config.addCollection('postsByYearNotes', (collection) => {
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

	// group three things by years
	config.addCollection('postsByYearThreeThings', (collection) => {
		const posts = collection.getFilteredByTag('three-things').reverse();
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

	return {
		dir: {
			input: './src',
			output: './_site',
		},
		passthroughFileCopy: true,
	};
};
