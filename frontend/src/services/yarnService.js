import jacquardYarnParser from 'jacquard-yarnparser';

const exportProjectToYarn = project =>
	// Map each of the nodes to its Yarn equivalent
	project.nodes.reduce((yarn, node) => {
		// Build the node Yarn
		// TODO: Use the header properties map from importProjectFromYarn
		// to generate the string
		const nodeYarn = `title: ${(node.title) ? node.title : ''}\n` +
		`tags: ${(node.tags) ? node.tags : ''}\n` +
		`section: ${(node.section) ? node.section : ''}\n` +
		`colorID: ${(node.colorId) ? node.colorId : ''}\n` +
		`position: ${(node.position) ? node.position : ''}\n` +
		'---\n' +
		`${(node.body) ? node.body : ''}\n` +
		'===\n';

		// Add it to the existing Yarn
		return yarn + nodeYarn;
	}, '');

const importProjectFromYarn = (yarn) => {
	// Split the yarn into nodes
	const yarnNodes = yarn.split('===');

	// The imported nodes
	const nodes = [];

	// Generate the nodes
	yarnNodes.forEach((yarnNode) => {
		// Split the node into header and body sections
		// We assume the header comes first, then the body
		const nodeParts = yarnNode.split('---');

		// Make sure we actually have a header
		if (nodeParts.length >= 1) {
			// Get the header
			const header = nodeParts[0];

			// Ignore the header if it's just a LF, CR, or CRLF (e.g. an empty line
			// at the end of a file)
			if ((header.length > 0) && (header !== '\n') && (header !== '\r') && (header !== '\r\n')) {
				// Parse the header into key/value pairs (making sure we handle
				// both LF, CR, and CRLF)
				const headerKeyValuePairs = header
					.replace('\r\n', '\n')
					.replace('\r', '\n')
					.split('\n');

				// Make sure we have at least one key/value pair in the header
				if (headerKeyValuePairs.length > 0) {
					// The node (empty by default)
					const node = {};

					// The header properties we're looking for and the node properties
					// they map to
					const headerProperties = {
						title: 'title',
						tags: 'tags',
						section: 'section',
						colorID: 'colorId',
						position: 'position',
					};

					// Parse the header key/value pairs to retrieve the header properties
					headerKeyValuePairs.forEach((headerKeyValuePair) => {
						// Split the key/value pair into a key and value
						// We assume the key comes first, then the value
						const keyAndValue = headerKeyValuePair.split(': ');

						// Check we have both a key and value
						if (keyAndValue.length === 2) {
							// Get the key and value
							const key = keyAndValue[0];
							const value = keyAndValue[1];

							// Is the key one of the header properties we're looking for?
							if (Object.prototype.hasOwnProperty.call(headerProperties, key)) {
								// Get the node property key
								const nodePropertyKey = headerProperties[key];

								// Store it in the node
								node[nodePropertyKey] = value;
							}
						}
					});

					// Set any missing header properties to empty
					Object.keys(headerProperties).forEach((headerProperty) => {
						// Get the node property key
						const nodePropertyKey = headerProperties[headerProperty];

						// Does the node not already have that property key
						if (!Object.prototype.hasOwnProperty.call(node, nodePropertyKey)) {
							// Set it to an empty string
							node[nodePropertyKey] = '';
						}
					});

					// Get the body (if we have any)
					const body = (nodeParts.length >= 2)
						? nodeParts[1]
						: '';

					// Record the body in the node
					node.body = body;

					// Add the node to the projects nodes
					nodes.push(node);
				}
			}
		}
	});

	// Build a project from the nodes
	const project = {
		name: 'Imported Project',
		nodes,
		characters: [],
		functions: [],
		variables: [],
	};

	return project;
};

const validateProjectNode = (projectFilePath, projectNode) => {
	// Build a dummy project with only the single node
	const project = {
		nodes: [projectNode],
	};

	// Export the project to Yarn
	const projectYarn = exportProjectToYarn(project);

	// Create a parser
	const parser = new jacquardYarnParser.Parser();

	// Parse the node
	const error = parser.parse(projectYarn, false, projectFilePath);

	// If there where errors or warnings, return them
	return (error)
		? { warnings: parser.warnings, errors: parser.errors }
		: null;
};

const exportYarnService = {
	exportProjectToYarn,
	importProjectFromYarn,
	validateProjectNode,
};

export default exportYarnService;
