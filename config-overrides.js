module.exports = function override(config) {
	// do stuff with the webpack config..
	config.externals = {
		electron: "require('electron')",
		child_process: "require('child_process')",
		fs: "require('fs')",
		path: "require('path')",
		bondage: "require('bondage')",
	};

	return config;
};
