// The local storage key of the projects JSON
const projectJSONKey = 'projectJSON';

// The local storage key of the projects file path
const projectFilePathKey = 'projectFilePath';

const set = (project) => {
	// Convert the value to a JSON string
	const projectJSON = JSON.stringify(project);

	// Record the JSON in local storage
	localStorage.setItem(projectJSONKey, projectJSON);
};

const get = () => {
	// Retrieve the project JSON string from local storage
	const projectJSON = localStorage.getItem(projectJSONKey);

	// Convert the JSON string to an object
	const project = (projectJSON)
		? JSON.parse(projectJSON)
		: null;

	return project;
};

const setFilePath = (projectFilePath) => {
	// Record the file path in local storage
	localStorage.setItem(projectFilePathKey, projectFilePath);
};

const getFilePath = () => localStorage.getItem(projectFilePathKey);

const clear = () => {
	// Clear the project values
	localStorage.setItem(projectJSONKey, '');
	localStorage.setItem(projectFilePathKey, '');
};

const projectService = {
	set,
	get,
	setFilePath,
	getFilePath,
	clear,
};

export default projectService;
