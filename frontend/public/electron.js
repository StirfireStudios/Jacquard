const electron = require('electron'); // eslint-disable-line

const {
	ipcMain, dialog, app, BrowserWindow,
} = electron;

const path = require('path');
const fs = require('fs');
// const url = require('url');
const isDev = require('electron-is-dev');

// The main window
let mainWindow = null;

// Whether we're closing the main window
let mainWindowIsBeingClosed = false;

// The project file path
let projectCurrentFilePath = '';

// Whether the project has been modified (assume it hasn't)
let projectIsModified = false;

const projectFilePathChangedMessage = 'project-file-path-changed';
const projectLoadedMessage = 'project-loaded';
const yarnLoadedMessage = 'yarn-loaded';

function createWindow() {
	mainWindow = new BrowserWindow({ width: 900, height: 680 });
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'index.html')}`);

	// Handle the window being closed
	mainWindow.on('close', (event) => {
		// Are we not closing the main window?
		if (!mainWindowIsBeingClosed) {
			// Has the project been modified?
			if (projectIsModified) {
				// Prevent the window from closing
				event.preventDefault();

				// Ask the user if they really want to close the application
				mainWindow.webContents.send('application-confirm-close');
			}
		}
	});

	mainWindow.on('closed', () => { mainWindow = null; });

	if (isDev) {
		// Install React Dev Tools
		const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer'); // eslint-disable-line
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => {
				console.log(`Added Extension:  ${name}`);
			})
			.catch((err) => {
				console.log('An error occurred: ', err);
			});
	}
}

const projectSave = (event, projectFilePath, projectJSON) => {
	// Write the project JSON to disk
	fs.writeFile(projectFilePath, projectJSON, (err) => {
		// Notify that the project file path has changed
		event.sender.send(projectFilePathChangedMessage, projectFilePath);

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

const projectSaveAs = (event, projectFilePath, projectJSON) => {
	// Get the current directory from the project file path (if we have one)
	const currentDirectoryPath = (projectFilePath)
		? path.dirname(projectFilePath)
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

			// Save the project JSON
			projectSave(event, fileName, projectJSON);
		},
	);
};

const projectExportAsYarn = (event, projectFilePath, projectYarn) => {
	// Get the current directory from the project file path (if we have one)
	const currentDirectoryPath = (projectFilePath)
		? path.dirname(projectFilePath)
		: '';

	// Show the Save As dialog
	dialog.showSaveDialog(
		{
			title: 'Export Project to Yarn',
			showTagsField: false,
			defaultPath: currentDirectoryPath,
			filters: [
				{ name: 'Yarn', extensions: ['yarn', 'yarn.txt'] },
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
			fs.writeFile(fileName, projectYarn, (err) => {
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

const projectOpen = (event, projectFilePath) => {
	// Get the current directory from the project file path (if we have one)
	const currentDirectoryPath = (projectFilePath)
		? path.dirname(projectFilePath)
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

const projectImportFromYarn = (event, projectFilePath) => {
	// Get the current directory from the project file path (if we have one)
	const currentDirectoryPath = (projectFilePath)
		? path.dirname(projectFilePath)
		: '';

	// Show the file selection dialog
	dialog.showOpenDialog(
		{
			title: 'Import Project from Yarn',
			showTagsField: false,
			defaultPath: currentDirectoryPath,
			filters: [
				{ name: 'Yarn', extensions: ['yarn', 'yarn.txt'] },
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
			const projectYarnFilePath = fileNames[0];

			fs.readFile(projectYarnFilePath, 'utf-8', (err, data) => {
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
					`${path.basename(projectYarnFilePath, path.extname(projectYarnFilePath))}.json`;
				const importedProjectFilePath = path.join(path.dirname(projectYarnFilePath), importedProjectFileName);

				// Notify that the project file path has changed
				event.sender.send(projectFilePathChangedMessage, importedProjectFilePath);

				// Notify that the project has been loaded
				event.sender.send(yarnLoadedMessage, data);
			});
		},
	);
};

const setWindowTitle = () => {
	// If the project has been modified, display an asterix after the file path
	const projectFilePath = (!projectIsModified)
		? projectCurrentFilePath
		: `${projectCurrentFilePath} *`;

	// Build the window title
	const windowTitle = (projectFilePath)
		? `Jacquard - ${projectFilePath}`
		: 'Jacquard';

	// Set the title of the window
	mainWindow.setTitle(windowTitle);
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
	const { projectFilePath, projectJSON } = arg;

	// Do we not have a project file path?
	if (!projectFilePath) {
		// Ask the user to save the project under a different file path
		projectSaveAs(event, projectFilePath, projectJSON);
	}

	// Save the project JSON
	projectSave(event, projectFilePath, projectJSON);
});

ipcMain.on('projectSaveAs', (event, arg) => {
	// Get the project info from the argument
	const { projectFilePath, projectJSON } = arg;

	// Ask the user to save the project under a different file path
	projectSaveAs(event, projectFilePath, projectJSON);
});

ipcMain.on('projectOpen', (event, projectFilePath) => {
	// As the user to select a project file to open
	projectOpen(event, projectFilePath);
});

ipcMain.on('projectImportFromYarn', (event, projectFilePath) => {
	// Ask the user to select a Yarn file to import
	projectImportFromYarn(event, projectFilePath);
});

ipcMain.on('projectExportToYarn', (event, arg) => {
	// Get the project info from the argument
	const { projectYarn, projectFilePath } = arg;

	// Ask the user to export the project as Yarn under a different file path
	projectExportAsYarn(event, projectFilePath, projectYarn);
});

ipcMain.on('applicationClose', () => {
	// We're closing the window
	mainWindowIsBeingClosed = true;

	// Close the window
	mainWindow.close();
});

ipcMain.on('showError', (event, arg) => {
	dialog.showErrorBox('Error', arg);
});

ipcMain.on('setProjectModified', (event, arg) => {
	// The argument specifies whether the project was modified
	projectIsModified = arg;

	// Set the window title
	setWindowTitle();
});

ipcMain.on('setProjectFilePath', (event, arg) => {
	// Record the project file path
	projectCurrentFilePath = arg;

	// Set the window title
	setWindowTitle();
});
