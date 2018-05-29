import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core//styles';

import themes from '../themes';
import Graph from '../../general/components/Graph';

import NodeEditorForm from '../modals/NodeEditorForm';

import yarnService from '../../../services/yarnService';

// The styles of the component
const styles = theme => ({
	...themes.defaultTheme(theme),
	// The graph style
	page: {
		height: '100%',
		width: '100%',
	},
});

// The Add/Edit form schema
const addEditFormSchema = [
	{
		fieldName: 'title',
		label: 'Title',
		readOnly: false,
		multiline: false,
	},
	{
		fieldName: 'tags',
		label: 'Tags',
		readOnly: false,
		multiline: false,
	},
	{
		fieldName: 'section',
		label: 'Section',
		readOnly: false,
		multiline: false,
	},
	{
		fieldName: 'colorId',
		label: 'Color ID',
		readOnly: false,
		multiline: false,
	},
	{
		fieldName: 'position',
		label: 'Position',
		readOnly: false,
		multiline: false,
	},
	{
		fieldName: 'body',
		label: 'Body',
		readOnly: false,
		multiline: false,
	},
];

// The default node color
const nodeDefaultColor = 'currentColor';

// Returns a node shape
const getNodeShape = (id, color) => (
	<symbol viewBox="0 0 100 100" id={id} key="0">
		<rect x="0" y="0" width="100" height="100" fill={color} />
	</symbol>
);

// The default graph configuration
const defaultGraphConfig = {
	nodeTypes: {
		nonExistingNode: {
			typeText: '',
			shapeId: '#nonExistingNode',
			shape: (
				<symbol viewBox="0 0 100 100" id="nonExistingNode" key="0">
					<rect x="0" y="0" width="100" height="100" fill="rgb(255, 0, 0)" />
				</symbol>
			),
		},
	},
	nodeSubtypes: {},
	edgeTypes: {
		nonExistingEdge: {
			shapeId: '#nonExistingEdge',
			shape: (
				<symbol viewBox="0 0 50 50" id="nonExistingEdge" key="0">
					<circle cx="25" cy="25" r="8" fill="rgb(255, 0, 0)" />
				</symbol>
			),
		},
		existingEdge: {
			shapeId: '#existingEdge',
			shape: (
				<symbol viewBox="0 0 50 50" id="existingEdge" key="0">
					<circle cx="25" cy="25" r="8" fill="currentColor" />
				</symbol>
			),
		},
	},
};

// The empty type. Text on empty nodes is positioned differently
const EMPTY_TYPE = 'nonExistingNode';

// The node key. This allows D3 to correctly update DOM
const NODE_KEY = 'id';

class VisualizationPage extends React.Component {
	constructor(props) {
		super(props);

		// Initialize the state of the component
		this.state = {
			// The Add/Edit form is initially closed
			addEditFormOpen: false,
			// Whether add mode is enabled for the Add/Edit form
			addEditFormAddModeEnabled: false,
			// The value referenced by the key of the Add/Edit forms data
			addEditFormDataKeyValue: null,
			// The position of the node
			addEditFormDataPositionX: 0,
			addEditFormDataPositionY: 0,
		};

		// Bind our handlers
		this.onAddEditFormOK = this.onAddEditFormOK.bind(this);
		this.onAddEditFormCancel = this.onAddEditFormCancel.bind(this);

		this.onNodeCreate = this.onNodeCreate.bind(this);
		this.onNodeClicked = this.onNodeClicked.bind(this);
		this.onNodePositionChanged = this.onNodePositionChanged.bind(this);
		this.onEdgeCreate = this.onEdgeCreate.bind(this);
	}

	onAddEditFormOK = (addEditFormDataPreviousKeyValue, addEditFormUpdatedData) => {
		// Get a copy of the project
		const project = { ...this.props.project };

		// Get the project nodes we'll be updating
		const projectNodes = project.nodes;

		// Is Add mode enabled?
		if (this.state.addEditFormAddModeEnabled) {
			// Add the form data to the projects row data
			projectNodes.push(addEditFormUpdatedData);
		} else {
			// Get the index of the node we'll be updating
			// We look up the row using the previous value of the key, since it
			// might have been changed during editing
			const nodeToUpdateIndex = this.props.project.nodes
				.findIndex(node =>
					node.title === addEditFormDataPreviousKeyValue);

			// If we found the node, update it
			if (nodeToUpdateIndex !== -1) {
				// Get the node to update
				const nodeToUpdate = projectNodes[nodeToUpdateIndex];

				// Update the node fields from the form data according to the form schema
				this.setFieldsBasedOnFormSchema(addEditFormUpdatedData, nodeToUpdate);
			}
		}

		// Notify the callback that the project has changed
		this.props.onProjectUpdated(project);

		// Close the Add/Edit form
		this.closeAddEditForm();
	}

	onAddEditFormCancel = () => {
		this.closeAddEditForm();
	}

	onNodeCreate = (x, y) => {
		// Open the form in Add mode and record the key value (i.e. the node
		// title) and position
		this.setState({
			addEditFormOpen: true,
			addEditFormAddModeEnabled: true,
			addEditFormDataKeyValue: '',
			addEditFormDataPositionX: x,
			addEditFormDataPositionY: y,
		});
	}

	onNodeClicked = (nodeTitle) => {
		// Open the form in Edit mode and record the key value (i.e. the node
		// title)
		this.setState({
			addEditFormOpen: true,
			addEditFormAddModeEnabled: false,
			addEditFormDataKeyValue: nodeTitle,
		});
	}

	onNodePositionChanged = (nodeTitle, x, y) => {
		// Get the index of the node we'll be updating
		const nodeToUpdateIndex = this.props.project.nodes
			.findIndex(node =>
				node.title === nodeTitle);

		// If we found the node, update it
		if (nodeToUpdateIndex !== -1) {
			// Get a copy of the project
			const project = { ...this.props.project };

			// Get the project nodes we'll be updating
			const projectNodes = project.nodes;

			// Get the node we'll be updating
			const nodeToUpdate = projectNodes[nodeToUpdateIndex];

			// Set the position
			nodeToUpdate.position = `${x}, ${y}`;

			// Notify the callback that the project has changed
			this.props.onProjectUpdated(project);
		}
	}

	onEdgeCreate = (sourceNode, destinationNode) => {
		// Get the source node index
		const nodeToUpdateIndex = this.props.project.nodes
			.findIndex(node =>
				node.title === sourceNode.title);

		// If we found the node, update it
		if (nodeToUpdateIndex !== -1) {
			// Get a copy of the project
			const project = { ...this.props.project };

			// Get the project nodes we'll be updating
			const projectNodes = project.nodes;

			// Get the node we'll be updating
			const nodeToUpdate = projectNodes[nodeToUpdateIndex];

			// Append a link to the destination to the body of the source node
			nodeToUpdate.body += `\n[[${destinationNode.title}]]`;

			// Notify the callback that the project has changed
			this.props.onProjectUpdated(project);
		}
	}

	setFieldsBasedOnFormSchema = (source, dest) => {
		addEditFormSchema.forEach((formField) => {
			dest[formField.fieldName] = source[formField.fieldName];
		});
	}

	closeAddEditForm = () => {
		this.setState({
			addEditFormOpen: false,
		});
	}

	buildNodeTypes = (projectNodes) => {
		// Add a node type for each project node
		const nodeTypes = projectNodes.reduce((accumulatedNodeTypes, node, nodeIndex) => {
			// Build the node ID
			const nodeId = `node${nodeIndex}`;

			// Get the node color
			const nodeColor = (node.colorId)
				? node.colorId
				: nodeDefaultColor;

			// Build the node shape
			const nodeShape = getNodeShape(nodeId, nodeColor);

			// Build the node type
			const nodeType = {
				typeText: '',
				shapeId: `#${nodeId}`,
				shape: nodeShape,
			};

			// Store the node type using the node ID as they key
			accumulatedNodeTypes[nodeId] = nodeType;

			return accumulatedNodeTypes;
		}, {});

		return nodeTypes;
	}

	// TODO: Use this to build existing and non-existing nodes too
	buildNodeEdges = (projectNodeLinks, nodeLinkKey) => {
		// If we don't have project node links, return nothing
		if (!projectNodeLinks) {
			return [];
		}

		// Get the node links
		const nodeLinks = projectNodeLinks[nodeLinkKey];

		// If we don't have any node links, return an empty array
		if (!nodeLinks) {
			return [];
		}

		// Build an edge for each incoming link
		const incomingEdges = Object.keys(nodeLinks.incomingLinks).map((incomingLinkKey) => {
			// Get the node
			const node = nodeLinks.incomingLinks[incomingLinkKey];

			// Figure out the edge type
			const type = (node)
				? 'existingEdge'
				: 'nonExistingEdge';

			// Build an edge
			return {
				source: incomingLinkKey,
				target: nodeLinkKey,
				type,
			};
		});

		// Build an edge for each outgoing link
		const outgoingEdges = Object.keys(nodeLinks.outgoingLinks).map((outgoingLinkKey) => {
			// Get the node
			const node = nodeLinks.outgoingLinks[outgoingLinkKey];

			// Figure out the edge type
			const type = (node)
				? 'existingEdge'
				: 'nonExistingEdge';

			// Build an edge
			return {
				source: nodeLinkKey,
				target: outgoingLinkKey,
				type,
			};
		});

		return [
			...incomingEdges,
			...outgoingEdges,
		];
	}

	buildEdges = projectNodeLinks =>
		// Build the edges of each node
		Object.keys(projectNodeLinks).reduce((edges, nodeLinkKey) => {
			// Build the edges of the node
			const nodeEdges = this.buildNodeEdges(projectNodeLinks, nodeLinkKey);

			// Add the node edges to the list of edges
			return [
				...edges,
				...nodeEdges,
			];
		}, []);

	buildExistingNodes = projectNodes =>
		// Add an existing node for each project node
		projectNodes.map((node, nodeIndex) => {
			// Build the node ID
			const nodeId = `node${nodeIndex}`;

			// Get the x/y position
			const positionArray = node.position.split(',');

			let x = (positionArray.length > 0) ? positionArray[0] : 0;
			if ((x === '') || Number.isNaN(x)) {
				x = 0;
			}

			let y = (positionArray.length > 1) ? positionArray[1] : 0;
			if ((y === '') || Number.isNaN(y)) {
				y = 0;
			}

			// Build the node
			return {
				id: node.title,
				title: node.title,
				x: Number(x),
				y: Number(y),
				type: nodeId,
			};
		});

	createNewAddEditFormData = () =>
		// Set up an empty field for each field in the form schema
		addEditFormSchema.reduce((addEditFormData, addEditFormField) => {
			addEditFormData[addEditFormField.fieldName] = '';
			return addEditFormData;
		}, {});

	render() {
		// Get the project node links
		const projectNodeLinks = yarnService
			.getProjectNodeLinks(this.props.projectFilePath, this.props.project.nodes);

		// Set up the add/edit form
		const AddEditForm = props => (
			<NodeEditorForm
				{...props}
				projectNodeLinks={projectNodeLinks}
				projectFilePath={this.props.projectFilePath}
			/>);

		// The title of the Add/Edit form
		let addEditFormTitle = '';

		// The Add/Edit form data
		let addEditFormData = null;

		// Are we adding an item?
		if (this.state.addEditFormAddModeEnabled) {
			// Set the Add/Edit form title
			addEditFormTitle = 'Add Node';

			// Create new Add/Edit form data
			addEditFormData = this.createNewAddEditFormData();

			// Set the title of the new node (if we have one)
			addEditFormData.title = this.state.addEditFormDataKeyValue || '';

			// Set the position of the new node
			addEditFormData.position = `${this.state.addEditFormDataPositionX}, ${this.state.addEditFormDataPositionY}`;
		} else {
			// Set the Add/Edit form title
			addEditFormTitle = 'Edit Node';

			// Generate the form data from the nodes
			addEditFormData = this.props.project.nodes.reduce((formData, node) => {
				if (node.title === this.state.addEditFormDataKeyValue) {
					this.setFieldsBasedOnFormSchema(node, formData);
				}

				return formData;
			}, {});
		}

		// Build the existing nodes (TODO: build non-existing nodes and existing
		// nodes by walking the incoming/outgoing links)
		const nodes = this.buildExistingNodes(this.props.project.nodes);

		// Build the edges
		const edges = this.buildEdges(projectNodeLinks);

		// Build the graph
		const graph = {
			nodes,
			edges,
		};

		// Build the node types
		const nodeTypes = this.buildNodeTypes(this.props.project.nodes);

		// Build the graph config
		const graphConfig = {
			...defaultGraphConfig,
		};

		// Set our node types
		graphConfig.nodeTypes = {
			...graphConfig.nodeTypes,
			...nodeTypes,
		};

		return (
			<div className={this.props.classes.page}>
				<AddEditForm
					onAddItemClick={() => {}}
					onEditItemClick={() => {}}
					onDataModified={this.props.onDataModified}
					onOK={this.onAddEditFormOK}
					onCancel={this.onAddEditFormCancel}
					title={addEditFormTitle}
					open={this.state.addEditFormOpen}
					addModeEnabled={this.state.addEditFormAddModeEnabled}
					schema={addEditFormSchema}
					dataKeyValue={this.state.addEditFormDataKeyValue}
					data={addEditFormData}
				/>
				<Graph
					graph={graph}
					graphConfig={graphConfig}
					nodeKey={NODE_KEY}
					emptyType={EMPTY_TYPE}
					onNodeCreate={this.onNodeCreate}
					onNodeClicked={this.onNodeClicked}
					onNodePositionChanged={this.onNodePositionChanged}
					onEdgeCreate={this.onEdgeCreate}
				/>
			</div>
		);
	}
}

VisualizationPage.propTypes = {
	onProjectUpdated: PropTypes.func.isRequired,
	onDataModified: PropTypes.func.isRequired,

	project: PropTypes.object,
	projectFilePath: PropTypes.string.isRequired,
};

VisualizationPage.defaultProps = {
	project: null,
};

export default withStyles(styles)(VisualizationPage);
