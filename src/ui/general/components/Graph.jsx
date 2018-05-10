import React from 'react';
import PropTypes from 'prop-types';

import GraphView from 'react-digraph';

// The styles of the component
const styles = {
    // The graph style
    graph: {
      height: '100%',
      width: '100%'
    }
};

class Graph extends React.Component {
    constructor(props) {
        super(props);

        // Set up the state of the component
        this.state = {
            selected: {}
        };
    }

    // Given a nodeKey, return the corresponding node
    getViewNode = (nodeKeyValue) => {
        // Find the node index
        const nodeIndex = this.findNodeIndex(nodeKeyValue);

        // Get the node
        const node = this.props.graph.nodes[nodeIndex];

        console.log(`getViewNode() - ${nodeKeyValue}, ${nodeIndex}`);
        console.log(node);

        return node;
    }

    findNodeIndex = (nodeKeyValue) =>
        this.props.graph.nodes
            .findIndex(node => (node[this.props.nodeKey] === nodeKeyValue));


    /* Define custom graph editing methods here */
    onSelectNode = () => {}
    onCreateNode = () => {}
    onUpdateNode = () => {}
    onDeleteNode = () => {}
    onSelectEdge = () => {}
    onCreateEdge = () => {}
    onSwapEdge = () => {}
    onDeleteEdge = () => {}

    render() {
        // Get the nodes
        const nodes = this.props.graph.nodes;

        // Get the edges
        const edges = this.props.graph.edges;

        // Get the selected nodes
        const selected = this.state.selected;

        // Get the node types
        const nodeTypes = this.props.graphConfig.nodeTypes;

        // Get the node sub-types
        const nodeSubtypes = this.props.graphConfig.nodeSubtypes;

        // Get the edge types
        const edgeTypes = this.props.graphConfig.edgeTypes;

        return (
            <div id='graph' style={styles.graph}>
                <GraphView 
                    ref='GraphView'
                    nodeKey={this.props.nodeKey}
                    emptyType={this.props.emptyType}
                    nodes={nodes}
                    edges={edges}
                    selected={selected}
                    nodeTypes={nodeTypes}
                    nodeSubtypes={nodeSubtypes}
                    edgeTypes={edgeTypes}
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