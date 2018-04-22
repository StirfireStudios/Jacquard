
const exportProjectToYarn = project =>
	// Map each of the nodes to its Yarn equivalent
	project.nodes.reduce((yarn, node) => {
		// Build the node Yarn
		const nodeYarn = `title: ${node.title}\n` +
		`tags: ${node.tags}\n` +
		`section: ${node.section}\n` +
		`colorID: ${node.colorId}\n` +
		`position: ${node.position}\n` +
		'---\n' +
		`${node.content}\n` +
		'===\n';

		// Add it to the existing Yarn
		return yarn + nodeYarn;
	}, '');

const exportYarnService = {
	exportProjectToYarn,
};

export default exportYarnService;
