const electron = require('electron'); // eslint-disable-line

const { Menu } = electron;

const OS = require('os');

function createMacMenu(app) {
    // Create the Application's main menu
    var template = [{
			label: "Application",
			submenu: [
					{ label: "About Jacquard", selector: "orderFrontStandardAboutPanel:" },
					{ type: "separator" },
					{ label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
			]}, {
			label: "Edit",
			submenu: [
					{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
					{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
					{ type: "separator" },
					{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
					{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
					{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
					{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
			]}
	];

	Menu.setApplicationMenu(Menu.buildFromTemplate(template));	
}

exports.createMenu = function(app) {
	if (OS.type() === 'Darwin') createMacMenu(app);
}