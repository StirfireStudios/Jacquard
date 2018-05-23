import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

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

// The graph configuration
const graphConfig = {
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
		existingNode: {
			typeText: '',
			shapeId: '#existingNode',
			shape: (
				<symbol viewBox="0 0 100 100" id="existingNode" key="0">
					<rect x="0" y="0" width="100" height="100" />
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
			// The value referenced by the key of the Add/Edit forms data
			addEditFormDataKeyValue: null,
		};

		// Bind our handlers
		this.onAddEditFormOK = this.onAddEditFormOK.bind(this);
		this.onAddEditFormCancel = this.onAddEditFormCancel.bind(this);

		this.onNodeClicked = this.onNodeClicked.bind(this);
		this.onNodePositionChanged = this.onNodePositionChanged.bind(this);
	}

	onAddEditFormOK = (addEditFormDataPreviousKeyValue, addEditFormUpdatedData) => {
		// Get the index of the node we'll be updating
		// We look up the row using the previous value of the key, since it
		// might have been changed during editing
		const nodeToUpdateIndex = this.props.project.nodes
			.findIndex(node =>
				node.title === addEditFormDataPreviousKeyValue);

		// If we found the node, update it
		if (nodeToUpdateIndex !== -1) {
			// Get a copy of the project
			const project = { ...this.props.project };

			// Get the project nodes we'll be updating
			const projectNodes = project.nodes;

			// Get the node to update
			const nodeToUpdate = projectNodes[nodeToUpdateIndex];

			// Update the node fields from the form data according to the form schema
			this.setFieldsBasedOnFormSchema(addEditFormUpdatedData, nodeToUpdate);

			// Notify the callback that the project has changed
			this.props.onProjectUpdated(project);
		}

		// Close the Add/Edit form
		this.closeAddEditForm();
	}

	onAddEditFormCancel = () => {
		this.closeAddEditForm();
	}

	onNodeClicked = (nodeTitle) => {
		console.log(`onNodeClicked(${nodeTitle})`);

		// Open the form in Edit mode and record the key value (i.e. the node
		// title)
		this.setState({
			addEditFormOpen: true,
			addEditFormDataKeyValue: nodeTitle,
		});
	}

	onNodePositionChanged = (nodeTitle, x, y) => {
		console.log(`onNodePositionChanged(${nodeTitle}, ${x}, ${y})`);

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

			console.log(`${nodeToUpdate.title} - (${nodeToUpdate.position})`);

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
		projectNodes.map((node) => {
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
				type: 'existingNode',
			};
		});

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

		// Set up the Add/Edit form title
		const addEditFormTitle = 'Edit Node';

		// Generate the form data from the row data
		const addEditFormData = this.props.project.nodes.reduce((formData, node) => {
			if (node.title === this.state.addEditFormDataKeyValue) {
				this.setFieldsBasedOnFormSchema(node, formData);
			}

			return formData;
		}, {});

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
					addModeEnabled={false}
					schema={addEditFormSchema}
					dataKeyValue={this.state.addEditFormDataKeyValue}
					data={addEditFormData}
				/>
				<Graph
					graph={graph}
					graphConfig={graphConfig}
					nodeKey={NODE_KEY}
					emptyType={EMPTY_TYPE}
					onNodeClicked={this.onNodeClicked}
					onNodePositionChanged={this.onNodePositionChanged}
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
