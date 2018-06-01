import { Parser } from 'jacquard-yarnparser';

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
							const value = keyAndValue[1].trim();

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

					// Nodes are dirty by default as they haven't been parsed
					node.dirty = true;

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
	// The errors and warnings
	let parserErrors = [];
	let parserWarnings = [];

	try {
		// Build a dummy project with only the single node
		const project = {
			nodes: [projectNode],
		};

		// Export the project to Yarn
		const projectYarn = exportProjectToYarn(project);

		// Create a parser
		const parser = new Parser();

		// Parse the node (ignoring the return value as it's really only for a
		// compiler toolchain)
		parser.parse(projectYarn, false, projectFilePath);

		// Get the errors and warnings
		parserErrors = parser.errors;
		parserWarnings = parser.warnings;
	} catch (error) {
		console.log(error);
	}

	// Return any errors or warnings
	return {
		errors: parserErrors,
		warnings: parserWarnings,
	};
};

const validateProjectNodes = (projectFilePath, projectNodes) => {
	// The project nodes validation results
	let projectNodeValidationResults = {
		nodes: {},
		generalErrors: [],
		generalWarnings: [],
	};

	let dirty = false;

	for(let index = 0; index < projectNodes.length; index++) {
		const node = projectNodes[index];
		if (node.dirty) {
			dirty = true;
			break;
		}
	}

	try {
		// Build a dummy project with only the single node
		const project = {
			nodes: projectNodes,
		};

		let errors = [];
		let warnings = [];

		if (dirty) {
			// Export the project to Yarn
			const projectYarn = exportProjectToYarn(project);

			// Create a parser
			const parser = new Parser();

			// Parse the node (ignoring the return value as it's really only for a
			// compiler toolchain)
			parser.parse(projectYarn, false, projectFilePath);

			for(let index = 0; index < projectNodes.length; index++) {
				projectNodes[index].dirty = false;
			}

			console.log("Validated!");

			errors = parser.errors;
			warnings = parser.warnings;
		}

		// Get the errors
		projectNodeValidationResults = errors.reduce((validationResults, validationError) => {
			// Get the node name of the error
			const { nodeName } = validationError.location;

			// If the error has a node name, add it to the nodes error list
			if (nodeName) {
				// Make sure we have validation results for the node
				if (!Object.prototype.hasOwnProperty.call(validationResults.nodes, nodeName)) {
					validationResults.nodes[nodeName] = {
						errors: [],
						warnings: [],
					};
				}

				// Include the error in the nodes validation results
				validationResults.nodes[nodeName].errors = [
					...validationResults.nodes[nodeName].errors,
					validationError,
				];
			} else {
				// Otherwise, add it to the general errors
				validationResults.generalErrors = [
					...validationResults.generalErrors,
					validationError,
				];
			}

			return validationResults;
		}, projectNodeValidationResults);

		// Get the warnings
		projectNodeValidationResults = warnings.reduce((validationResults, validationWarning) => {
			// Get the node name of the warning
			const { nodeName } = validationWarning.location;

			// If the error has a node name, add it to the nodes error list
			if (nodeName) {
				// Make sure we have validation results for the node
				if (!Object.prototype.hasOwnProperty.call(validationResults.nodes, nodeName)) {
					validationResults.nodes[nodeName] = {
						errors: [],
						warnings: [],
					};
				}

				// Include the warning in the nodes validation results
				validationResults.nodes[nodeName].warnings = [
					...validationResults.nodes[nodeName].warnings,
					validationWarning,
				];
			} else {
				// Otherwise, add it to the general warnings
				validationResults.generalWarnings = [
					...validationResults.generalWarnings,
					validationWarning,
				];
			}

			return validationResults;
		}, projectNodeValidationResults);

	} catch (error) {
		console.log(error);
	}

	return projectNodeValidationResults;
};

const getProjectNodeLinks = (projectFilePath, projectNodes) => {
	// The project node links
	let projectNodeLinks = null;

	try {
		// Build a dummy project with the project nodes
		const project = {
			nodes: projectNodes,
		};

		// Export the project to Yarn
		const projectYarn = exportProjectToYarn(project);

		// Create a parser
		const parser = new Parser();

		// Parse the node (ignoring the return value as it's really only for a
		// compiler toolchain)
		parser.parse(projectYarn, false, projectFilePath);

		// Get the named nodes
		const parserNamedNodes = parser.nodeNames.reduce((namedNodes, nodeName) => {
			namedNodes[nodeName] = parser.nodeNamed(nodeName);
			return namedNodes;
		}, {});

		// Build the node links by actualizing the links of each node so we can
		// retrieve the incoming and outgoing links
		projectNodeLinks = Object.keys(parserNamedNodes).reduce((nodeLinks, nodeName) => {
			// Get the node
			const node = parserNamedNodes[nodeName];

			// Actualize it's links
			node.actualizeLinks(parserNamedNodes);

			// Record the links for the node
			nodeLinks[nodeName] = {
				outgoingLinks: node.outgoingLinks,
				incomingLinks: node.incomingLinks,
			};

			return nodeLinks;
		}, {});
	} catch (error) {
		console.log(error);
	}

	// Return the project node links (if any)
	return projectNodeLinks;
};

const buildLocationString = location => `${location.fileID}
 (${location.start.line}, ${location.start.column}) -
 (${location.end.line}, ${location.end.column})`;

const exportYarnService = {
	exportProjectToYarn,
	importProjectFromYarn,
	validateProjectNode,
	validateProjectNodes,
	getProjectNodeLinks,
	buildLocationString,
};

export default exportYarnService;
