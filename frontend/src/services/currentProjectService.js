const currentProjectKey = 'currentProject';

function set(val) {
	// Convert the value to a JSON string
	const currentProjectJSON = JSON.stringify(val);

	// Record the JSON in local storage
	localStorage.setItem(currentProjectKey, currentProjectJSON);
}

function get() {
	// Retrieve the current project JSON string from local storage
	const currentProjectJSON = localStorage.getItem(currentProjectKey);

	// Convert the JSON string to an object
	const currentProject = JSON.parse(currentProjectJSON);

	return currentProject;
}

function clear() {
	// Clear the current project JSON by setting it to null
	localStorage.setItem(currentProjectKey, null);
}

const currentProjectService = {
	set,
	get,
	clear,
};

export default currentProjectService;
