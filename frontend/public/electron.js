const electron = require('electron');

const {
	ipcMain, dialog, app, BrowserWindow,
} = electron;

const path = require('path');
const fs = require('fs');
// const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ width: 900, height: 680 });
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('saveAsClick', (event, arg) => {
	// You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
	dialog.showSaveDialog(
		{
			title: 'Save Yarn File',
			showTagsField: false,

		},
		(fileName) => {
			if (fileName === undefined) {
				console.log("You didn't save the file");
				return;
			}

			const content = arg;

			// fileName is a string that contains the path and filename created in the save file dialog.
			fs.writeFile(fileName, content, (err) => {
				if (err) {
					dialog.showMessageBox({
						title: 'Error',
						message: `An error ocurred creating the file :${err.message}`,
						type: 'error',
					});
				}

				dialog.showMessageBox({
					title: 'Success',
					message: 'The file saved successfully',
					type: 'info',
				});
			});
		},
	);
});

ipcMain.on('openClick', (event) => {
	dialog.showOpenDialog((fileNames) => {
		// fileNames is an array that contains all the selected
		if (fileNames === undefined || fileNames.length < 1) {
			console.log('No file selected');
			return;
		}

		fs.readFile(fileNames[0], 'utf-8', (err, data) => {
			if (err) {
				dialog.showMessageBox({
					title: 'Error',
					message: `An error ocurred reading the file :${err.message}`,
					type: 'error',
				});
				return;
			}

			event.sender.send('content-loaded', data);
		});
	});
});
