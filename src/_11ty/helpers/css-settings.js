const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postCssCsso = require('postcss-csso');
const postCssImport = require('postcss-import');

module.exports = {
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
};
