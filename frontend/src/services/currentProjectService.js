// The local storage key of the current projects JSON
const currentProjectJSONKey = 'currentProjectJSON';

// The local storage key of the current projects file path
const currentProjectFilePathKey = 'currentProjectFilePath';

const set = (currentProject) => {
	// Convert the value to a JSON string
	const currentProjectJSON = JSON.stringify(currentProject);

	// Record the JSON in local storage
	localStorage.setItem(currentProjectJSONKey, currentProjectJSON);
};

const get = () => {
	// Retrieve the current project JSON string from local storage
	const currentProjectJSON = localStorage.getItem(currentProjectJSONKey);

	// Convert the JSON string to an object
	const currentProject = JSON.parse(currentProjectJSON);

	return currentProject;
};

const setFilePath = (currentProjectFilePath) => {
	// Record the file path in local storage
	localStorage.setItem(currentProjectFilePathKey, currentProjectFilePath);
};

const getFilePath = () => localStorage.getItem(currentProjectFilePathKey);

const clear = () => {
	// Clear the current project values
	localStorage.setItem(currentProjectJSONKey, '');
	localStorage.setItem(currentProjectFilePathKey, '');
};

const currentProjectService = {
	set,
	get,
	setFilePath,
	getFilePath,
	clear,
};

export default currentProjectService;
