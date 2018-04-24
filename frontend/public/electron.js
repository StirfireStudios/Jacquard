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
const yarnLoadedMessage = 'yarn-loaded';

function createWindow() {
	mainWindow = new BrowserWindow({ width: 900, height: 680 });
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'index.html')}`);
	mainWindow.on('closed', () => { mainWindow = null; });
}

const currentProjectSave = (event, currentProjectFilePath, currentProjectJSON) => {
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

const currentProjectSaveAs = (event, currentProjectFilePath, currentProjectJSON) => {
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
			currentProjectSave(event, fileName, currentProjectJSON);
		},
	);
};

const currentProjectExportAsYarn = (event, currentProjectFilePath, currentProjectYarn) => {
	// Get the current directory from the project file path (if we have one)
	const currentDirectoryPath = (currentProjectFilePath)
		? path.dirname(currentProjectFilePath)
		: '';

	// Show the Save As dialog
	dialog.showSaveDialog(
		{
			title: 'Export Project to Yarn',
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

const currentProjectOpen = (event, currentProjectFilePath) => {
	// Get the current directory from the project file path (if we have one)
	const currentDirectoryPath = (currentProjectFilePath)
		? path.dirname(currentProjectFilePath)
		: '';

	// Show the file selection dialog
	dialog.showOpenDialog(
		{
			title: 'Open Project',
			showTagsField: false,
			defaultPath: currentDirectoryPath,
			filters: [
				{ name: 'JSON', extensions: ['json'] },
				{ name: 'All Files', extensions: ['*'] },
			],
		},
		(fileNames) => {
			// fileNames is an array that contains all the selected
			if (fileNames === undefined || fileNames.length < 1) {
				console.log('No file selected');
				return;
			}

			// Get the project file path
			const selectedProjectFilePath = fileNames[0];

			fs.readFile(selectedProjectFilePath, 'utf-8', (err, data) => {
				if (err) {
					dialog.showMessageBox({
						title: 'Error',
						message: `An error ocurred reading the file :${err.message}`,
						type: 'error',
					});
					return;
				}

				// Notify that the project file path has changed
				event.sender.send(projectFilePathChangedMessage, selectedProjectFilePath);

				// Notify that the project has been loaded
				event.sender.send(projectLoadedMessage, data);
			});
		},
	);
};

const currentProjectImportFromYarn = (event, currentProjectFilePath) => {
	// Get the current directory from the project file path (if we have one)
	const currentDirectoryPath = (currentProjectFilePath)
		? path.dirname(currentProjectFilePath)
		: '';

	// Show the file selection dialog
	dialog.showOpenDialog(
		{
			title: 'Import Project from Yarn',
			showTagsField: false,
			defaultPath: currentDirectoryPath,
			filters: [
				{ name: 'Yarn', extensions: ['yarn'] },
				{ name: 'All Files', extensions: ['*'] },
			],
		},
		(fileNames) => {
			// fileNames is an array that contains all the selected
			if (fileNames === undefined || fileNames.length < 1) {
				console.log('No file selected');
				return;
			}

			// Get the project Yarn file path
			const currentProjectYarnFilePath = fileNames[0];

			fs.readFile(currentProjectYarnFilePath, 'utf-8', (err, data) => {
				if (err) {
					dialog.showMessageBox({
						title: 'Error',
						message: `An error ocurred reading the file :${err.message}`,
						type: 'error',
					});
					return;
				}

				// Get the project file path from the Yarn file path by
				// replacing the file extension with '.json'
				const importedProjectFileName =
					`${path.basename(currentProjectYarnFilePath, path.extname(currentProjectYarnFilePath))}.json`;
				const importedProjectFilePath = path.join(path.dirname(currentProjectYarnFilePath), importedProjectFileName);

				// Notify that the project file path has changed
				event.sender.send(projectFilePathChangedMessage, importedProjectFilePath);

				// Notify that the project has been loaded
				event.sender.send(yarnLoadedMessage, data);
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
	const { currentProjectFilePath, currentProjectJSON } = arg;

	// Do we not have a project file path?
	if (!currentProjectFilePath) {
		// Ask the user to save the project under a different file path
		currentProjectSaveAs(event, currentProjectFilePath, currentProjectJSON);
	}

	// Save the current project JSON
	currentProjectSave(event, currentProjectFilePath, currentProjectJSON);
});

ipcMain.on('projectSaveAs', (event, arg) => {
	// Get the project info from the argument
	const { currentProjectFilePath, currentProjectJSON } = arg;

	// Ask the user to save the project under a different file path
	currentProjectSaveAs(event, currentProjectFilePath, currentProjectJSON);
});

ipcMain.on('projectOpen', (event, currentProjectFilePath) => {
	// As the user to select a project file to open
	currentProjectOpen(event, currentProjectFilePath);
});

ipcMain.on('projectImportFromYarn', (event, currentProjectFilePath) => {
	// Ask the user to select a Yarn file to import
	currentProjectImportFromYarn(event, currentProjectFilePath);
});

ipcMain.on('projectExportToYarn', (event, arg) => {
	// Get the project info from the argument
	const { currentProjectYarn, currentProjectFilePath } = arg;

	// Ask the user to export the project as Yarn under a different file path
	currentProjectExportAsYarn(event, currentProjectFilePath, currentProjectYarn);
});

ipcMain.on('setWindowTitleInfo', (event, arg) => {
	// Build the window title
	const windowTitle = (arg)
		? `Jacquard - ${arg}`
		: 'Jacquard';

	// Set the title of the window
	mainWindow.setTitle(windowTitle);
});
