const nunjucks = require('nunjucks');
const inclusiveLanguage = require('@11ty/eleventy-plugin-inclusive-language');

const utils = './_includes/utils';
const siteName = require(`${utils}/site-name`);

module.exports = (config) => {
	const nunjucksEnv = new nunjucks.Environment(
		new nunjucks.FileSystemLoader('_includes')
	);
	config.setLibrary('njk', nunjucksEnv);
	
	config.addPlugin(inclusiveLanguage, {
		templateFormats: ['md'],
		words: 'simply,obviously,basically,of course,clearly,just,everyone knows,however,easy'
	});

	config.addNunjucksShortcode('siteName', siteName);

	return {
		dir: {
			input: './',
			output: './_site'
		},
		passthroughFileCopy: true
	};
};
