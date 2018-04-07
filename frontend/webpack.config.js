const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	externals: {
		electron: "require('electron')",
		child_process: "require('child_process')",
		fs: "require('fs')",
		path: "require('path')",
	},
};
