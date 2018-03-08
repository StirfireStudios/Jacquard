const currentProjectKey = 'currentProject';

function set(val) {
	localStorage.setItem(currentProjectKey, JSON.stringify(val));
}

function get() {
	return JSON.parse(localStorage.getItem(currentProjectKey));
}

function clear() {
	localStorage.setItem(currentProjectKey, null);
}

const currentProjectService = {
	set,
	get,
	clear,
};

export default currentProjectService;
