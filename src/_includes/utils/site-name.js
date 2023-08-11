const data = require('../../_data/site');

const siteName = (name) => {
	name = data.options.title;
	return name;
};

module.exports = siteName;
