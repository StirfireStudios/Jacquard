import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import themes from '../themes';
import Graph from '../../general/components/Graph';

import yarnService from '../../../services/yarnService';

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

	buildEdges = () => {
		// Get the project node links
		const projectNodeLinks = yarnService
			.getProjectNodeLinks(this.props.projectFilePath, this.props.project.nodes);

		// Build the edges of each node
		return Object.keys(projectNodeLinks).reduce((edges, nodeLinkKey) => {
			// Build the edges of the node
			const nodeEdges = this.buildNodeEdges(projectNodeLinks, nodeLinkKey);

			// Add the node edges to the list of edges
			return [
				...edges,
				...nodeEdges,
			];
		}, []);
	}

	buildExistingNodes = () =>
		// Add an existing node for each project node
		this.props.project.nodes.map((node) => {
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

			return {
				id: node.title,
				title: node.title,
				x: Number(x),
				y: Number(y),
				type: 'existingNode',
			};
		});

	render() {
		// Build the existing nodes (TODO: build non-existing nodes and existing
		// nodes by walking the incoming/outgoing links)
		const nodes = this.buildExistingNodes();

		// Build the edges
		const edges = this.buildEdges();

		// Build the graph
		const graph = {
			nodes,
			edges,
		};

		return (
			<Graph
				graph={graph}
				graphConfig={graphConfig}
				nodeKey={NODE_KEY}
				emptyType={EMPTY_TYPE}
			/>
		);
	}
}

VisualizationPage.propTypes = {
	project: PropTypes.object,
	projectFilePath: PropTypes.string.isRequired,
};

VisualizationPage.defaultProps = {
	project: null,
};

export default withStyles(themes.defaultTheme)(VisualizationPage);
