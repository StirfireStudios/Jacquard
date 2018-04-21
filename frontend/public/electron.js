const electron = require('electron');

const {
	ipcMain, dialog, app, BrowserWindow,
} = electron;

const path = require('path');
const fs = require('fs');
// const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

const projectFilePathChangedMessage = 'project-file-path-changed';
const projectLoadedMessage = 'project-loaded';

function createWindow() {
	mainWindow = new BrowserWindow({ width: 900, height: 680 });
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	mainWindow.on('closed', () => { mainWindow = null; });
}

const currentProjectSave = (event, currentProjectJSON, currentProjectFilePath) => {
	// Write the project JSON to disk
	fs.writeFile(currentProjectFilePath, currentProjectJSON, (err) => {
		// Notify that the project file path has changed
		event.sender.send(projectFilePathChangedMessage, currentProjectFilePath);

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
};

const currentProjectSaveAs = (event, currentProjectJSON, currentProjectFilePath) => {
	// Get the current directory from the project file path (if we have one)
	const currentDirectoryPath = (currentProjectFilePath)
		? path.dirname(currentProjectFilePath)
		: '';

	// Show the Save As dialog
	dialog.showSaveDialog(
		{
			title: 'Save Project',
			showTagsField: false,
			defaultPath: currentDirectoryPath,
			filters: [
				{ name: 'Jacquard Projects', extensions: ['json'] },
				{ name: 'All Files', extensions: ['*'] },
			],
		},
		(fileName) => {
			// Do we not have a filename?
			if (!fileName) {
				console.log('Unable to save the file');
				return;
			}

			// Save the current project JSON
			currentProjectSave(event, currentProjectJSON, fileName);
		},
	);
};

const currentProjectExportAsYarn = (event, currentProjectYarn, currentProjectFilePath) => {
	// Get the current directory from the project file path (if we have one)
	const currentDirectoryPath = (currentProjectFilePath)
		? path.dirname(currentProjectFilePath)
		: '';

	// Show the Save As dialog
	dialog.showSaveDialog(
		{
			title: 'Export Project as Yarn',
			showTagsField: false,
			defaultPath: currentDirectoryPath,
			filters: [
				{ name: 'Yarn', extensions: ['yarn'] },
				{ name: 'All Files', extensions: ['*'] },
			],
		},
		(fileName) => {
			// Do we not have a filename?
			if (!fileName) {
				console.log('Unable to export to Yarn');
				return;
			}

			// Write the project Yarn to disk
			fs.writeFile(fileName, currentProjectYarn, (err) => {
				if (err) {
					dialog.showMessageBox({
						title: 'Error',
						message: `An error ocurred exporting to Yarn :${err.message}`,
						type: 'error',
					});
				}

				dialog.showMessageBox({
					title: 'Success',
					message: 'The project was successfully exported to Yarn',
					type: 'info',
				});
			});
		},
	);
};

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

ipcMain.on('projectSave', (event, arg) => {
	// Get the project info from the argument
	const { currentProjectJSON, currentProjectFilePath } = arg;

	// Do we not have a project file path?
	if (!currentProjectFilePath) {
		// Ask the user to save the project under a different file path
		currentProjectSaveAs(event, currentProjectJSON, currentProjectFilePath);
	}

	// Save the current project JSON
	currentProjectSave(event, currentProjectJSON, currentProjectFilePath);
});

ipcMain.on('projectSaveAs', (event, arg) => {
	// Get the project info from the argument
	const { currentProjectJSON, currentProjectFilePath } = arg;

	// Ask the user to save the project under a different file path
	currentProjectSaveAs(event, currentProjectJSON, currentProjectFilePath);
});

ipcMain.on('projectOpen', (event) => {
	dialog.showOpenDialog((fileNames) => {
		// fileNames is an array that contains all the selected
		if (fileNames === undefined || fileNames.length < 1) {
			console.log('No file selected');
			return;
		}

		// Get the project file path
		const currentProjectFilePath = fileNames[0];

		fs.readFile(currentProjectFilePath, 'utf-8', (err, data) => {
			if (err) {
				dialog.showMessageBox({
					title: 'Error',
					message: `An error ocurred reading the file :${err.message}`,
					type: 'error',
				});
				return;
			}

			// Notify that the project file path has changed
			event.sender.send(projectFilePathChangedMessage, currentProjectFilePath);

			// Notify that the project has been loaded
			event.sender.send(projectLoadedMessage, data);
		});
	});
});


ipcMain.on('projectExportAsYarn', (event, arg) => {
	// Get the project info from the argument
	const { currentProjectYarn, currentProjectFilePath } = arg;

	// Ask the user to export the project as Yarn under a different file path
	currentProjectExportAsYarn(event, currentProjectYarn, currentProjectFilePath);
});

ipcMain.on('setWindowTitleInfo', (event, arg) => {
	mainWindow.setTitle(`Jacquard - ${arg}`);
});
