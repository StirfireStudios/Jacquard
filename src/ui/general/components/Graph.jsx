import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core//styles';

import GraphView from '../../react-digraph/graph-view';

// The styles of the component
const styles = () => ({
	// The graph style
	graph: {
		height: '100%',
		width: '100%',
	},
});

class Graph extends React.Component {
	constructor(props) {
		super(props);

		// Set up the state of the component
		this.state = {
			selected: {},
		};
	}

	/* Define custom graph editing methods here */
	onCreateNode = (x, y) => {
		this.props.onNodeCreate(x, y);
	}

	onDeleteNode = () => {}

	onSelectEdge = () => {}

	onCreateEdge = (sourceNode, destinationNode) => {
		this.props.onEdgeCreate(sourceNode, destinationNode);
	}

	onSwapEdge = () => {}
	onDeleteEdge = () => {}

	// Called when the selects a view node
	onSelectNode = (viewNode) => {
		// Get the selected nodes
		let { selected } = this.state;

		// Do we have a selected node?
		if (viewNode) {
			// Get the node ID
			const nodeId = viewNode.id;

			// Is the node already selected?
			if ((Object.prototype.hasOwnProperty.call(selected, nodeId))) {
				// Unselected it
				delete selected[nodeId];
			} else {
				// Select it
				selected[nodeId] = viewNode;
			}
		} else {
			// Clear all selected nodes
			selected = {};
		}

		this.setState({
			selected,
		});
	}

	// Called when the user clicks on a view node
	onClickNode = (viewNode) => {
		// Was a view node selected?
		if (viewNode) {
			this.props.onNodeClicked(viewNode.title);
		}
	}

	// Called when the user moves a node
	onUpdateNode = (viewNode) => {
		// Was a view node updated?
		if (viewNode) {
			this.props.onNodePositionChanged(
				viewNode.title,
				viewNode.x,
				viewNode.y,
			);
		}
	}

	// Called when the nodes are updated in bulk
	onUpdateNodes = (viewNodes) => {
		// Were view nodes updated?
		if (viewNodes) {
			// Build the changed nodes
			const nodes = viewNodes.map(viewNode => ({
				title: viewNode.title,
				x: viewNode.x,
				y: viewNode.y,
			}));

			// Build update the nodes
			this.props.onNodePositionsChanged(nodes);
		}
	}

	// Given a nodeKey, return the corresponding node
	getViewNode = (nodeKeyValue) => {
		// Find the node index
		const nodeIndex = this.findNodeIndex(nodeKeyValue);

		// Get the node
		const node = this.props.graph.nodes[nodeIndex];

		return node;
	}

	findNodeIndex = nodeKeyValue =>
		this.props.graph.nodes
			.findIndex(node => (node[this.props.nodeKey] === nodeKeyValue));

	render() {
		return (
			<div id="graph" className={this.props.classes.graph}>
				<GraphView
					ref={(c) => { this.GraphView = c; }}
					nodeKey={this.props.nodeKey}
					emptyType={this.props.emptyType}
					nodes={this.props.graph.nodes}
					edges={this.props.graph.edges}
					selected={this.state.selected}
					nodeTypes={this.props.graphConfig.nodeTypes}
					nodeSubtypes={this.props.graphConfig.nodeSubtypes}
					edgeTypes={this.props.graphConfig.edgeTypes}
					graphControls
					enableFocus={false}
					transitionTime={0}
					zoomDelay={500}
					zoomDur={750}
					minZoom={0.05}
					maxZoom={1.5}
					maxTitleChars={100}
					getViewNode={this.getViewNode}
					onSelectNode={this.onSelectNode}
					onClickNode={this.onClickNode}
					onCreateNode={this.onCreateNode}
					onUpdateNode={this.onUpdateNode}
					onUpdateNodes={this.onUpdateNodes}
					onDeleteNode={this.onDeleteNode}
					onSelectEdge={this.onSelectEdge}
					onCreateEdge={this.onCreateEdge}
					onSwapEdge={this.onSwapEdge}
					onDeleteEdge={this.onDeleteEdge}
				/>
			</div>
		);
	}
}

Graph.propTypes = {
	onNodeCreate: PropTypes.func.isRequired,
	onNodeClicked: PropTypes.func.isRequired,
	onNodePositionChanged: PropTypes.func.isRequired,
	onNodePositionsChanged: PropTypes.func.isRequired,
	onEdgeCreate: PropTypes.func.isRequired,

	graph: PropTypes.object,
	graphConfig: PropTypes.object,
	nodeKey: PropTypes.string.isRequired,
	emptyType: PropTypes.string.isRequired,
};

Graph.defaultProps = {
	graph: {
		nodes: [],
		edges: [],
	},
	graphConfig: {},
};


export default withStyles(styles, { withTheme: true })(Graph);
