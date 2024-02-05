module.exports = (str = '', limit = 30) => {
	return str.toString().trim().split(/\s+/g, limit).join(' ') + '&hellip;';
};
