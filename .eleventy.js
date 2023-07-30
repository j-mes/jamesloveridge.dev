const nunjucks = require('nunjucks');
const inclusiveLanguage = require('@11ty/eleventy-plugin-inclusive-language');
const pluginRss = require('@11ty/eleventy-plugin-rss');

const utils = './_includes/utils';
const blocks = './_includes/blocks';
const siteName = require(`${utils}/site-name`);

module.exports = (config) => {
	const nunjucksEnv = new nunjucks.Environment(
		new nunjucks.FileSystemLoader('_includes'),
	);

	config.addPassthroughCopy('images');
	config.addPassthroughCopy('main.css');
	config.addPassthroughCopy('CNAME');
	config.setLibrary('njk', nunjucksEnv);
	config.addPlugin(inclusiveLanguage, {
		templateFormats: ['md'],
		words:
			'simply,obviously,basically,of course,clearly,just,everyone knows,however,easy',
	});
	config.addPlugin(pluginRss);
	config.addNunjucksShortcode('siteName', siteName);

	return {
		dir: {
			input: './',
			output: './_site',
		},
		passthroughFileCopy: true,
	};
};
