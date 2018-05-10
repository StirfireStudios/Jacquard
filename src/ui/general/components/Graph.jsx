import React from 'react';
import PropTypes from 'prop-types';

import GraphView from 'react-digraph';

// The styles of the component
const styles = {
	// The graph style
	graph: {
		height: '100%',
		width: '100%',
	},
};

class Graph extends React.Component {
	constructor(props) {
		super(props);

		// Set up the state of the component
		this.state = {
			selected: {},
		};
	}

	/* Define custom graph editing methods here */
	onSelectNode = () => {}
	onCreateNode = () => {}
	onUpdateNode = () => {}
	onDeleteNode = () => {}
	onSelectEdge = () => {}
	onCreateEdge = () => {}
	onSwapEdge = () => {}
	onDeleteEdge = () => {}

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
			<div id="graph" style={styles.graph}>
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
					readOnly
					graphControls
					maxTitleChars={100}
					getViewNode={this.getViewNode}
					onSelectNode={this.onSelectNode}
					onCreateNode={this.onCreateNode}
					onUpdateNode={this.onUpdateNode}
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


export default Graph;
