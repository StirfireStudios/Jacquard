/* eslint-disable */ 

// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/*
  GraphView is a Generic D3 Graph view with no application specific
  code in it and no significant state except UI state (zoom, for example).
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Radium from 'radium';
import GraphControls from './graph-controls.js';


function styleToString(style) {
	return Object.keys(style)
		.map((k) => {
			const key = k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
			return `${key}:${style[k]}`;
		}).join(';');
}


function makeStyles(primary = 'dodgerblue', light = 'white', dark = 'black', background = '#F9F9F9') {
	const styles = {
		wrapper: {
			base: {
				height: '100%',
				margin: 0,
				display: 'flex',
				boxShadow: 'none',
				opacity: 0.5,
				background,
				transition: 'opacity 0.167s',
			},
			focused: {
				opacity: 1,
			},
		},
		svg: {
			base: {
				alignContent: 'stretch',
				flex: 1,
			},
		},
		node: {
			base: {
				color: primary,
				stroke: light,
				fill: light,
				filter: 'url(#dropshadow)',
				strokeWidth: '0.5px',
				cursor: 'pointer',
			},
			selected: {
				color: light,
				stroke: primary,
				fill: primary,
			},
		},
		shape: {
			fill: 'inherit',
			stroke: dark,
			strokeWidth: '0.5px',
		},
		text: {
			base: {
				fill: dark,
				stroke: dark,
			},
			selected: {
				fill: light,
				stroke: light,
			},
		},
		edge: {
			base: {
				color: light,
				stroke: primary,
				strokeWidth: '2px',
				markerEnd: 'url(#end-arrow)',
				cursor: 'pointer',
			},
			dragged: {
				color: light,
				stroke: primary,
				strokeWidth: '4px',
			},
			selectedSource: {
				color: primary,
				stroke: primary,
				strokeWidth: '4px',
			},
			selectedTarget: {
				color: dark,
				stroke: dark,
				strokeWidth: '4px',
			},
		},
		arrow: {
			fill: primary,
		},
	};

	// Styles need to be strings for D3 to apply them all at once
	styles.node.baseString = styleToString(styles.node.base);
	styles.node.selectedString = styleToString({ ...styles.node.base, ...styles.node.selected });
	styles.text.baseString = styleToString(styles.text.base);
	styles.text.selectedString = styleToString({ ...styles.text.base, ...styles.text.selected });
	styles.edge.baseString = styleToString(styles.edge.base);
	styles.edge.draggedString = styleToString({ ...styles.edge.base, ...styles.edge.dragged });
	styles.edge.selectedSourceString = styleToString({ ...styles.edge.base, ...styles.edge.selectedSource });
	styles.edge.selectedTargetString = styleToString({ ...styles.edge.base, ...styles.edge.selectedTarget });

	return styles;
}

// any objects with x & y properties
function getTheta(pt1, pt2) {
	const xComp = pt2.x - pt1.x;
	const yComp = pt2.y - pt1.y;
	const theta = Math.atan2(yComp, xComp);
	return theta;
}

function getMidpoint(pt1, pt2) {
	const x = (pt2.x + pt1.x) / 2;
	const y = (pt2.y + pt1.y) / 2;

	return { x, y };
}

function getDistance(pt1, pt2) {
	return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}

const isNodeInSelected = (d, selected) => (selected)
	? (Object.keys(selected).findIndex(key => d === selected[key]) >= 0)
	: false;

const isEdgeInSelected = (edgeNodeId, selected) => (selected)
	? (Object.keys(selected).findIndex(key => edgeNodeId === key) >= 0)
	: false;

class GraphView extends Component {
	constructor(props) {
		super(props);

		const sessionStorageGraphViewTransformJSON = sessionStorage.getItem("graphViewTransform");
		const sessionStorageGraphViewTransform = (sessionStorageGraphViewTransformJSON)
			? JSON.parse(sessionStorageGraphViewTransformJSON)
			: null;

		const viewTransform = (sessionStorageGraphViewTransform)
			? d3.zoomIdentity
				.translate(sessionStorageGraphViewTransform.x, sessionStorageGraphViewTransform.y)
				.scale(sessionStorageGraphViewTransform.k)
			: d3.zoomIdentity;

		this.state = {
			viewTransform,
			selectionChanged: false,
			focused: true,
			enableFocus: props.enableFocus || false, // Enables focus/unfocus
			edgeSwapQueue: [], // Stores nodes to be swapped
			styles: makeStyles(props.primary, props.light, props.dark, props.background),
		};

		this.zoom = d3.zoom()
			.scaleExtent([props.minZoom, props.maxZoom])
			.on('zoom', this.handleZoom);

		this.nodeTimeouts = {};
		this.edgeTimeouts = {};

		this.handleSvgClicked = this.handleSvgClicked.bind(this);
		this.handleZoomToFit = this.handleZoomToFit.bind(this);
	}

	componentDidMount() {
		// Window event listeners for keypresses
		// and to control blur/focus of graph
		d3.select(this.viewWrapper)
			.on('keydown', this.handleWrapperKeydown);

		const svg = d3.select(this.viewWrapper)
			.on('touchstart', this.containZoom)
			.on('touchmove', this.containZoom)
			.on('click', this.handleSvgClicked)
			.select('svg')
			.call(this.zoom);

		// On the initial load, the 'view' <g> doesn't exist
		// until componentDidMount. Manually render the first view.
		this.renderView();

		// Set the zoom (required to force drawing of edges)
		if (this.viewWrapper != null) {
			this.setZoom(this.state.viewTransform.k,
				this.state.viewTransform.x,
				this.state.viewTransform.y,
				0);
		}
	}

	componentWillUnmount() {
		// Remove window event listeners
		d3.select(this.viewWrapper)
			.on('keydown', null);
	}

	componentWillReceiveProps(nextProps) {
		// Is the selected object different in the new properties?
		if (nextProps.selected !== this.props.selected) {
			// The selection type (default to the current selection type)
			let selectionType = this.state.selectionType;

			// Get the keys of the selected nodes
			const selectedNodeKeys = Object.keys(nextProps.selected)

			// Do we have any selected nodes?
			if (selectedNodeKeys.length > 0) {
				// Get the key of the first selected node
				const firstSelectedNodeKey = selectedNodeKeys[0];

				// Get the first selected node
				const firstSelectedNode = nextProps.selected[firstSelectedNodeKey];

				// Do we have any selected nodes, and does the first one have the
				// 'source' property?
				if (firstSelectedNode.source) {
					selectionType = 'edge';
				} else if (firstSelectedNode[this.props.nodeKey]) {
					// Does the first node have a property with the name stored
					// in the 'nodeKey' prop?         
					selectionType = 'node';
				}
			}

			this.setState({
				selected: nextProps.selected,
				previousSelection: this.props.selected,
				selectionChanged: true,
				selectionType,
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.selectionChanged) {
			this.setState({
				selectionChanged: false,
			});
		}
	}

    /*
     * Handlers/Interaction
     */

    hideEdge = (edgeDOMNode) => {
    	d3.select(edgeDOMNode)
    		.attr('opacity', 0);
    }

    showEdge = (edgeDOMNode) => {
    	d3.select(edgeDOMNode)
    		.attr('opacity', 1);
    }

    canSwap = (sourceNode, hoveredNode, swapEdge) => swapEdge.source != sourceNode[this.props.nodeKey] ||
            swapEdge.target != hoveredNode[this.props.nodeKey]

    lineFunction = data =>
    // Provides API for curved lines using .curve()
    // Example: https://bl.ocks.org/d3indepth/64be9fc39a92ef074034e9a8fb29dcce
    	(d3.line()
    		.x(d => d.x)
    		.y(d => d.y))(data)


    drawEdge = (sourceNode, target, swapErrBack) => {
    	const self = this;

    	const dragEdge = d3.select(this.entities).append('svg:path');

    	dragEdge.attr('class', 'link dragline')
    		.attr('style', this.state.styles.edge.draggedString)
    		.attr('d', this.lineFunction([
    			{ x: sourceNode.x, y: sourceNode.y },
    			{ x: d3.event.x, y: d3.event.y },
    		]));

    	d3.event.on('drag', dragged).on('end', ended);

    	function dragged(d) {
    		dragEdge.attr('d', self.lineFunction([
    			{ x: sourceNode.x, y: sourceNode.y },
    			{ x: d3.event.x, y: d3.event.y },
    		]));
    	}

    	function ended(d) {
    		dragEdge.remove();

    		const swapEdge = self.state.edgeSwapQueue.shift();
    		const hoveredNode = self.state.hoveredNode;

    		self.setState({
    			edgeSwapQueue: self.state.edgeSwapQueue,
    			drawingEdge: false,
    		});

    		if (hoveredNode && self.props.canCreateEdge(sourceNode, hoveredNode)) {
    			if (swapEdge) {
    				if (self.props.canDeleteEdge(swapEdge) && self.canSwap(sourceNode, hoveredNode, swapEdge)) {
    					self.props.onSwapEdge(sourceNode, hoveredNode, swapEdge);
    					self.renderView();
    				} else {
    					swapErrBack();
    				}
    			} else {
					if (sourceNode !== hoveredNode) {
						self.props.onCreateEdge(sourceNode, hoveredNode);
					}
					self.renderView();
				}
    		} else {
    			if (swapErrBack) {
    				swapErrBack();
    			}
    		}
    	}
    }

    dragNode = (draggedNode) => {
    	const self = this;

		// Record the start position of the node
		const dragStartX = draggedNode.x;
		const dragStartY = draggedNode.y;

    	const el = d3.select(d3.event.target.parentElement); // Enclosing 'g' element
    	el.classed('dragging', true);
		d3.event.on('drag', dragged).on('end', ended);
		
    	let oldSibling = null;
    	function dragged(d) {
			if (self.props.readOnly) return;
			
			// Get the selected node ID
			const selectedNodeId = d.id;

			const selectedNode = d3.select(this);

			if (!oldSibling) {
    			oldSibling = this.nextSibling;
    		}
    		// Moves child to the end of the element stack to re-arrange the z-index
    		this.parentElement.appendChild(this);

    		selectedNode.attr('transform', (d) => {
    			d.x += d3.event.dx;
    			d.y += d3.event.dy;
    			return `translate(${d.x},${d.y})`;
			});
			
			// Get the nodes
			const nodes = d3.select(self.entities).selectAll('g.node');

			// Drag every selected node
			nodes.each((nodeDatum, nodeIndex, nodesGroup) => {
				// Ignore it if it's the node we're dragging
				if (nodeDatum.id !== selectedNodeId) {
					// Is the node selected
					if (isNodeInSelected(nodeDatum, self.props.selected)) {
						d3.select(nodesGroup[nodeIndex])
							.attr('transform', (d) => {
								d.x += d3.event.dx;
								d.y += d3.event.dy;
								return `translate(${d.x},${d.y})`;
							});
					}
				}
			});

			self.render();
		}

    	function ended() {
    		el.classed('dragging', false);

			if (!self.props.readOnly) {
				// Get the selected node
				const selectedNode = d3.select(this).datum();

				// Calculate the drag distance
				const dragXDistance = selectedNode.x - dragStartX;
				const dragYDistance = selectedNode.y - dragStartY;

				// Did we move?
				if ((dragXDistance !== 0) || (dragYDistance !== 0)) {
					// Move the node back to the original z-index
					if ((oldSibling) && (oldSibling.parentElement)) {
						oldSibling.parentElement.insertBefore(this, oldSibling);
					}

					self.props.onUpdateNode(selectedNode);

					Object.keys(self.props.selected).forEach((nodeKey) => {
						// Get the node
						const node = self.props.selected[nodeKey];
		
						// Ignore it if it's the node we're dragging
						if (node !== selectedNode) {
							self.props.onUpdateNode(node);
						}
					});
				} else {
					// Fire a mouse up event to trigger selection
					d3.select(this).node().dispatchEvent(new Event('mouseup'));					
				}
    		}
    	}
    }

    // Node 'drag' handler
    handleNodeDrag = (draggedNode) => {
    	if (this.state.drawingEdge && !this.props.readOnly) {
    		const target = { x: d3.event.subject.x, y: d3.event.subject.y };
    		this.drawEdge(d3.event.subject, target);
    	} else {
    		this.dragNode(draggedNode);
    	}
    }

    handleDelete = () => {
		// If we're read-only, do nothing
		if (this.props.readOnly) return;
		
		// Get the keys of the selected nodes
		const selectedNodeKeys = Object.keys(this.props.selected)

		// Do we have any selected nodes?
		if (selectedNodeKeys.length > 0) {
			// Get the key of the first selected node
			const firstSelectedNodeKey = selectedNodeKeys[0];

			// Get the first selected node
			const firstSelectedNode = this.props.selected[firstSelectedNodeKey];

			// Do we have any selected nodes, and does the first one have the
			// 'source' property?
			if (firstSelectedNode.source) {
				// Does the first node have a property with the name stored
				// in the 'nodeKey' prop?         
				selectedNodeKeys.forEach((selectedNodeKey) => {
					// Get the selected node
					const selectedNode = this.props.selected[selectedNodeKey];

					// Can we delete the node edge?
					if (this.props.canDeleteEdge(selectedNode)) {
						// Delete the node edge
						this.props.onDeleteEdge(selectedNode);		
					}
				});
			} else if (firstSelectedNode[this.props.nodeKey]) {
				// Does the first node have a property with the name stored
				// in the 'nodeKey' prop?         
				selectedNodeKeys.forEach((selectedNodeKey) => {
					// Get the selected node
					const selectedNode = this.props.selected[selectedNodeKey];

					// Can we delete the node?
					if (this.props.canDeleteNode(selectedNode)) {
						// Delete the node
						this.props.onDeleteNode(selectedNode);		
					}
				});
			}

			// Notify that the node(s) are no longer selected
    		this.props.onSelectNode(null);
    	}
    }

    handleWrapperKeydown = (d, i) => {
    	// Conditionally ignore keypress events on the window
    	// if the Graph isn't focused
    	switch (d3.event.key) {
    	case 'Delete':
    		this.handleDelete();
    		break;
    	case 'Backspace':
    		this.handleDelete();
    		break;
    	default:
    		break;
    	}
    }

    handleSvgClicked = (d, i) => {
		// If any part of the edge is clicked, return
    	if (this.isPartOfEdge(d3.event.target)) return;

		// Are we selecting a node?
    	if (this.state.selectingNode) {
			// We're no longer selecting a node
    		this.setState({
    			selectingNode: false,
    		});
    	} else {
			// Clear any selection
			this.props.onSelectNode(null);
			
			// Store our 'this'
			const self = this;

			// Are we not read-only?
    		if (!this.props.readOnly) {
				// Is the SHIFT key held down but not the CTRL key?
				if ((d3.event.shiftKey) && (!d3.event.ctrlKey)) {
					// Create a new node at the current mouse position
					const xycoords = d3.mouse(event.target);
					this.props.onCreateNode(xycoords[0], xycoords[1]);
					this.renderView();
				} else if ((d3.event.shiftKey) && (d3.event.ctrlKey)) {
					// Are the SHIFT key and CTRL key both held down?

					// Get the width and height of the graph
					const parent = d3.select(this.viewWrapper).node();
					const width = parent.clientWidth;
					const height = parent.clientHeight;		

					// Get the nodes
					const nodes = d3.select(this.entities).selectAll('g.node')
					const nodesData = nodes.data();

					// Get the links
					const links = this.props.edges.map(link => ({
						source: `${nodesData.findIndex(node => node.id === link.source)}`,
						target: `${nodesData.findIndex(node => node.id === link.target)}`
					}));

					// Filter out any broken links
					const filteredLinks = links.filter(link => (link.source !== '-1') && (link.target !== '-1'));

					// Set up the force simulation
					const simulation = d3.forceSimulation(nodesData)
						.alphaDecay(0.125)
						.force('center', d3.forceCenter(0, 0))
						.force('charge', d3.forceManyBody().strength(-10000))
						.force("link", d3.forceLink(filteredLinks))
						.on('tick', () => {
							// Re-position each node
							nodes.each((nodeDatum, nodeIndex, nodesGroup) => {
								d3.select(nodesGroup[nodeIndex])
								.attr('transform', (d) => {
									return `translate(${d.x},${d.y})`;
								});
							});

							// Re-render the graph
							self.render();
						})
						.on('end', () => {
							// Notify that each of the nodes have updated
							self.props.nodes.forEach((node) => {
								// Notify that the node has updated
								self.props.onUpdateNode(node);
							});
						})
						.stop();

					// See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
					for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
						simulation.tick();
					}

					// Zoom to fit the entire graph on screen
					this.handleZoomToFit();
				}
			}
    	}
    }

    isPartOfEdge = (element) => {
    	while (element != null && element != this.viewWrapper) {
    		if (element.classList.contains('edge')) {
    			return true;
    		}
    		element = element.parentElement;
    	}
    	return false;
    }

    handleNodeMouseDown = (d) => {
    	if (d3.event.defaultPrevented) {
    		return; // dragged
    	}

    	// Prevent d3's default as it changes the focus to the body
    	d3.event.preventDefault();
		d3.event.stopPropagation();
		
		// If the view wrapper is not the active element, set focus on it
    	if (document.activeElement != this.viewWrapper) {
    		this.viewWrapper.focus();
    	}

		// Is the SHIFT key held down?
    	if (d3.event.shiftKey) {
			// We're drawing an edge
    		this.setState({
    			selectingNode: true,
    			drawingEdge: true,
    		});
    	} else if (d3.event.ctrlKey) {
			// Is the CTRL key held down?

			// Record that we're selecting a node in our state and notify that
			// the node was selected
			this.setState({
    			selectingNode: true,
			},
			() => this.props.onSelectNode(d));
    	}
    }

    handleNodeMouseUp = (d) => {
    	if (!this.state.selectingNode) {
			// Prevent d3's default as it changes the focus to the body
			d3.event.preventDefault();
			d3.event.stopPropagation();

			this.props.onClickNode(d);
		}
		
		this.setState({
			selectingNode: false,
		});
    }

    handleNodeMouseEnter = (d) => {
    	if (this.state.hoveredNode != d) {
    		this.setState({
    			hoveredNode: d,
    		});
    	}
    }

    handleNodeMouseLeave = (d) => {
    	// For whatever reason, mouseLeave is fired when edge dragging ends
    	// (and mouseup is not fired). This clears the hoverNode state prematurely
    	// resulting in swapEdge failing to fire.
    	// Detecting & ignoring mouseLeave events that result from drag ending here
    	const fromMouseup = event.which == 1;
    	if (this.state.hoveredNode === d && !fromMouseup) {
    		this.setState({
    			hoveredNode: null,
    		});
    	}
    }

    // One can't attach handlers to 'markers' or obtain them from the event.target
    // If the click occurs within a certain radius of edge target,
    // assume the click occurred on the arrow
    arrowClicked = (d) => {
    	if (event.target.tagName != 'path') return false; // If the handle is clicked

    	const xycoords = d3.mouse(event.target);
		
		const target = this.props.getViewNode(d.target);
		if (!target) return false;

    	const dist = getDistance({ x: xycoords[0], y: xycoords[1] }, target);

    	return dist < this.props.nodeSize / 2 + this.props.edgeArrowSize + 10; // or *2 or ^2?
    }

    handleEdgeDrag = (d) => {
    	if (!this.props.readOnly && this.state.drawingEdge) {
    		const edgeDOMNode = event.target.parentElement;
			const sourceNode = this.props.getViewNode(d.source);
			if (sourceNode) {
				const xycoords = d3.mouse(event.target);
				const target = { x: xycoords[0], y: xycoords[1] };

				this.hideEdge(edgeDOMNode);
				this.drawEdge(sourceNode, target, this.showEdge.bind(this, edgeDOMNode));
			}
    	}
    }


    handleEdgeMouseDown = (d) => {
    	// Prevent d3's default as it changes the focus to the body
    	d3.event.preventDefault();
    	d3.event.stopPropagation();
    	if (document.activeElement != this.viewWrapper) {
    		this.viewWrapper.focus();
    	}

    	if (!this.props.readOnly && this.arrowClicked(d)) {
    		this.state.edgeSwapQueue.push(d); // Set this edge aside for redrawing
    		this.setState({
    			drawingEdge: true,
    			edgeSwapQueue: this.state.edgeSwapQueue,
    		});
    	} else {
    		this.props.onSelectEdge(d);
    	}
    }

    // Keeps 'zoom' contained
    containZoom = () => {
    	d3.event.preventDefault();
    }

    // View 'zoom' handler
    handleZoom = () => {
    	if (this.state.focused) {
			const viewTransform = d3.event.transform;
			const viewTransformJSON = (viewTransform)
				? JSON.stringify(viewTransform)
				: '';

    		this.setState({
    			viewTransform,
			},
			() => sessionStorage.setItem("graphViewTransform", viewTransformJSON));
    	}
    }

    // Zooms to contents of this.refs.entities
    handleZoomToFit = (cb = () => {}) => {
    	const parent = d3.select(this.viewWrapper).node();
    	const entities = d3.select(this.entities).node();

    	const viewBBox = entities.getBBox();

    	const width = parent.clientWidth;
    	const height = parent.clientHeight;

    	let dx,
    		dy,
    		x,
    		y,
    		translate = [this.state.viewTransform.x, this.state.viewTransform.y],
    		next = { x: translate[0], y: translate[1], k: this.state.viewTransform.k };

    	if (viewBBox.width > 0 && viewBBox.height > 0) {
    		// There are entities
    		dx = viewBBox.width,
    		dy = viewBBox.height,
    		x = viewBBox.x + viewBBox.width / 2,
    		y = viewBBox.y + viewBBox.height / 2;

    		next.k = 0.9 / Math.max(dx / width, dy / height);

    		if (next.k < this.props.minZoom) {
    			next.k = this.props.minZoom;
    		} else if (next.k > this.props.maxZoom) {
    			next.k = this.props.maxZoom;
    		}

    		next.x = width / 2 - next.k * x;
    		next.y = height / 2 - next.k * y;
    	} else {
    		next.k = (this.props.minZoom + this.props.maxZoom) / 2;
    		next.x = 0;
    		next.y = 0;
    	}

    	this.setZoom(next.k, next.x, next.y, this.props.zoomDur, cb);
    }

    // Updates current viewTransform with some delta
    modifyZoom = (modK = 0, modX = 0, modY = 0, dur = 0) => {
    	const parent = d3.select(this.viewWrapper).node();
    	const width = parent.clientWidth;
    	const height = parent.clientHeight;

    	let target_zoom,
    		center = [width / 2, height / 2],
    		extent = this.zoom.scaleExtent(),
    		translate = [this.state.viewTransform.x, this.state.viewTransform.y],
    		translate0 = [],
    		l = [],
    		next = { x: translate[0], y: translate[1], k: this.state.viewTransform.k };

    	target_zoom = next.k * (1 + modK);

    	if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

    	translate0 = [(center[0] - next.x) / next.k, (center[1] - next.y) / next.k];
    	next.k = target_zoom;
    	l = [translate0[0] * next.k + next.x, translate0[1] * next.k + next.y];

    	next.x += center[0] - l[0] + modX;
    	next.y += center[1] - l[1] + modY;

    	this.setZoom(next.k, next.x, next.y, dur);
    }

    // Programmatically resets zoom
    setZoom = (k = 1, x = 0, y = 0, dur = 0, cb = () => {}) => {
		const t = d3.zoomIdentity.translate(x, y).scale(k);
		
		d3.select(this.viewWrapper)
			.select('svg')
			.call(this.zoom.transform, this.state.viewTransform)
    		.transition()
    		.duration(dur)
			.call(this.zoom.transform, t)
			.on("end", cb);
    }

    /*
     * Render
     */

    // Returns the svg's path.d' (geometry description) string from edge data
    // edge.source and edge.target are node ids
    // @deprecated - not removed due to potential third party integrations
    getPathDescriptionStr = (sourceX, sourceY, targetX, targetY) => `M${sourceX},${sourceY}L${targetX},${targetY}`

    getPathDescription = (edge) => {
    	const src = this.props.getViewNode(edge.source);
    	const trg = this.props.getViewNode(edge.target);

    	if (src && trg) {
    		const off = this.props.nodeSize / 2; // from the center of the node to the perimeter

    		const theta = getTheta(src, trg);

    		const xOff = off * Math.cos(theta);
    		const yOff = off * Math.sin(theta);

    		return this.lineFunction([
    			{ x: src.x + xOff, y: src.y + yOff },
    			{ x: trg.x - xOff, y: trg.y - yOff },
    		]);
    	}

		return '';
    }

    getEdgeHandleTransformation = (edge) => {
    	const src = this.props.getViewNode(edge.source);
    	const trg = this.props.getViewNode(edge.target);
		if (src && trg) {
			const origin = getMidpoint(src, trg);
			const x = origin.x;
			const y = origin.y;
			const theta = getTheta(src, trg) * 180 / Math.PI;
			const offset = -this.props.edgeHandleSize / 2;

			return `translate(${x}, ${y}) rotate(${theta}) translate(${offset}, ${offset})`;
		}

		return '';
    }

    // Returns a d3 transformation string from node data
    getNodeTransformation = node => `translate(${node.x},${node.y})`

	isNodeInSelec	

    getNodeStyle = (d, selected) => isNodeInSelected(d, selected) ?
    	this.state.styles.node.selectedString :
    	this.state.styles.node.baseString;

    getEdgeStyle = (d, selected) => {
		if (isEdgeInSelected(d.source, selected)) {
			return this.state.styles.edge.selectedSourceString;
		} else if (isEdgeInSelected(d.target, selected)) {
			return this.state.styles.edge.selectedTargetString;
		}

		return this.state.styles.edge.baseString;
	}

    getTextStyle = (d, selected) => isNodeInSelected(d, selected) ?
    	this.state.styles.text.selectedString :
    	this.state.styles.text.baseString;

    // Renders 'node.title' into node element
    renderNodeText = (d, domNode) => {
    	const d3Node = d3.select(domNode);
    	const title = d.title ? d.title : ' ';

    	const titleText = title.length <= this.props.maxTitleChars ? title :
    		`${title.substring(0, this.props.maxTitleChars)}...`;

    	const lineOffset = 18;
    	const textOffset = d.type === this.props.emptyType ? -9 : 18;

    	d3Node.selectAll('text').remove();

    	const typeText = this.props.nodeTypes[d.type].typeText;
    	const style = this.getTextStyle(d, this.props.selected);

    	const el = d3Node.append('text')
    		.attr('text-anchor', 'middle')
    		.attr('style', style)
    		.attr('dy', textOffset);

    	el.append('tspan')
    		.attr('opacity', 0.5)
    		.text(typeText);

    	if (title) {
    		// User defined/secondary text
    		el.append('tspan').text(titleText).attr('x', 0).attr('dy', lineOffset);

    		el.append('title').text(title);
    	}
    }

    // Renders 'edges' into entities element
    renderEdges = (entities, edges) => {
    	const self = this;

    	// Join Data
    	var edges = entities.selectAll('g.edge')
    		.data(edges, d =>
    		// IMPORTANT: this snippet allows D3 to detect updated vs. new data
    			`${d.source}:${d.target}` );

    	// Remove Old
    	edges.exit()
    		.remove();

    	// Add New
    	const newEdges = edges.enter().append('g').classed('edge', true);

    	newEdges
    		.on('mousedown', this.handleEdgeMouseDown)
    		.call(d3.drag().on('start', this.handleEdgeDrag));

    	newEdges.attr('opacity', 0)
    		.transition()
    		.duration(self.props.transitionTime)
    		.attr('opacity', 1);

    	// Merge
    	edges.enter().merge(edges);

    	function updateEdge(d, i, els) {
    		// setTimeout is used to unblock the browser
    		// clearing the previous render's timeout prevents the browser from being overworked
    		const key = `edgeKey-${d.source}_${d.target}`;
    		if (self.edgeTimeouts[key]) {
    			clearTimeout(self.edgeTimeouts[key]);
    		}
    		self.edgeTimeouts[key] = setTimeout(() => {
    			self.props.renderEdge(self, this, d, i, els);
    		});
    	}

    	// Update All
    	edges.each(updateEdge);
    }

    // Renders 'nodes' into entities element
    renderNodes = (entities, nodes) => {
    	const self = this;
    	const nodeKey = this.props.nodeKey;
    	const parent = this.viewWrapper;
    	const viewTransform = this.state.viewTransform;
    	const overlap = (300 / viewTransform.k);

    	// Join Data
    	let nodeKeyWarned = false;
    	const nodesSelection = entities.selectAll('g.node').data(nodes, (d) => {
    		// IMPORTANT: this snippet allows D3 to detect updated vs. new data
    		if (d[nodeKey] === undefined && !nodeKeyWarned) {
    			console.warn(`Warning: The specified nodeKey '${nodeKey}' cannot be found on a node. \
            Make sure the nodeKey is accurate and that all nodes contain a property called '${nodeKey}'. \
            Performance will degrade when there are nodes with an undefined nodeKey or with duplicate keys.`);
    			nodeKeyWarned = true;
    		}
    		return d[nodeKey];
    	});

    	// Animate/Remove Old
    	const removedNodes = nodesSelection.exit()
    		.transition()
    		.duration(self.props.transitionTime)
    		.attr('opacity', 0)
    		.remove();

    	// Add New
    	const newNodes = nodesSelection.enter().append('g').classed('node', true);

    	newNodes.on('mousedown', this.handleNodeMouseDown)
    		.on('mouseup', this.handleNodeMouseUp)
    		.on('click', (d) => {
    			// Force blocking propagation on node click.
    			// It was found that large graphs would handle clicks on the canvas even
    			// though the mouseDown event blocked propagation.
    			d3.event.stopPropagation();
    			d3.event.preventDefault();
    		})
    		.on('mouseenter', this.handleNodeMouseEnter)
    		.on('mouseleave', this.handleNodeMouseLeave)
    		.call(d3.drag().on('start', this.handleNodeDrag));

    	newNodes
    		.attr('opacity', 0)
    		.transition()
    		.duration(self.props.transitionTime)
    		.attr('opacity', 1);

    	// Merge
    	nodesSelection.enter().merge(nodesSelection);

    	function updateNode(d, i, els) {
    		const key = `nodeKey-${d[nodeKey]}`;
    		// setTimeout is used to unblock the browser
    		// clearing the previous render's timeout prevents the browser from being overworked
    		if (self.nodeTimeouts[key]) {
    			clearTimeout(self.nodeTimeouts[key]);
    		}
    		self.nodeTimeouts[key] = setTimeout(() => {
    			self.props.renderNode(self, this, d, i, els);
    		});
    	}

    	// Update Selected and Unselected
    	// New or Removed
    	const selected = nodesSelection.filter(d => (isNodeInSelected(d, this.props.selected) ||
			isNodeInSelected(d, this.state.previousSelection)));

    	/*
        The commented code below would prevent nodes from rendering
        until they are within the viewport. The problem is that this causes a zoom-to-fit
        regression. The benefit from the code is that even a gigantic graph is very responsive at first,
        however as a person zooms out or moves the graph around it would add more nodes.
        After many nodes are added to the graph the zoom behavior will degrade, and there's no way to
        remove the existing nodes from the DOM which are outside of the viewport. This degraded performance already
        exists in the zoom-to-fit scenario for large graphs, since all nodes are rendered and never removed.
        TODO: figure out if it's possible/worthwhile to remove nodes from the graph that are outside of the viewport
        TODO: figure out the zoom-to-fit if this is added
      */
    	// function viewableFilter(d) {
    	// const xPosition = (d.x + viewTransform.x) * viewTransform.k;
    	// const yPosition = (d.y + viewTransform.y) * viewTransform.k;
    	// return xPosition < parent.offsetWidth + overlap &&
    	//   xPosition > 0 - overlap &&
    	//   yPosition < parent.offsetHeight + overlap &&
    	//   yPosition > 0 - overlap;
    	// }
    	// selected.filter(viewableFilter).each(updateNode);
    	// removedNodes.filter(viewableFilter).each(updateNode);
    	// newNodes.filter(viewableFilter).each(updateNode);

    	selected.each(updateNode);
    	removedNodes.each(updateNode);
    	newNodes.each(updateNode);

    	const newState = {};

    	// Update all others
    	// Normally we would want to only render all others on a zoom change,
    	// however sometimes other nodes must be updated on a selection
    	nodesSelection.filter((d) => {
    		const isInSelected = selected.filter(sd => sd === d).size();
    		const isInNewNodes = newNodes.filter(nd => nd === d).size();
    		const isInRemovedNodes = removedNodes.filter(rd => rd === d).size();

    		return (
    		// viewableFilter(d) && // see comment above
    			!isInSelected &&
          !isInNewNodes &&
          !isInRemovedNodes
    		);
    	}).each(updateNode);
    }

    // Renders 'graph' into view element
    // All DOM updates within 'view' are managed by D3
    renderView = () => {
    	const nodes = this.props.nodes;
    	const edges = this.props.edges;

    	// Update the view w/ new zoom/pan
    	const view = d3.select(this.view)
    		.attr('transform', this.state.viewTransform);

    	const entities = d3.select(this.entities);

    	this.renderNodes(entities, nodes);
    	this.renderEdges(entities, edges);
    }


    render() {
    	this.renderView();
    	const { styles, focused } = this.state;
    	return (
    		<div
				className="viewWrapper"
    			tabIndex={0}
    			onFocus={() => {
    				this.setState({
    					focused: true,
    				});
    			}}
				onBlur={() => {
    				if (this.props.enableFocus) {
    					this.setState({
    						focused: false,
    					});
    				}
    			}}
				ref={el => this.viewWrapper = el}
				style={[
    				styles.wrapper.base,
    				!!focused && styles.wrapper.focused,
    				this.props.style,
    			]}
			>
				<svg style={styles.svg.base}>
    				{ this.props.renderDefs(this) }
					<g className="view" ref={el => this.view = el}>
    					{ this.props.renderBackground(this) }
						<g className="entities" ref={el => this.entities = el} />
    				</g>
    			</svg>
    			{this.props.graphControls && (
    				<GraphControls
						primary={this.props.primary}
						minZoom={this.props.minZoom}
						maxZoom={this.props.maxZoom}
						zoomLevel={this.state.viewTransform.k}
    					zoomToFit={this.handleZoomToFit}
    					modifyZoom={this.modifyZoom}
					/>
    			)}
    		</div>
    	);
    }
}

GraphView.propTypes = {
	nodeKey: PropTypes.string.isRequired,
	emptyType: PropTypes.string.isRequired,
	nodes: PropTypes.array.isRequired,
	edges: PropTypes.array.isRequired,
	selected: PropTypes.object,
	nodeTypes: PropTypes.object.isRequired,
	nodeSubtypes: PropTypes.object.isRequired,
	edgeTypes: PropTypes.object.isRequired,
	getViewNode: PropTypes.func.isRequired,
	onSelectNode: PropTypes.func.isRequired,
	onClickNode: PropTypes.func.isRequired,
	onCreateNode: PropTypes.func.isRequired,
	onUpdateNode: PropTypes.func.isRequired,
	onUpdateNodes: PropTypes.func.isRequired,
	onUpdateNodes: PropTypes.func.isRequired,
	onDeleteNode: PropTypes.func.isRequired,
	onSelectEdge: PropTypes.func.isRequired,
	onCreateEdge: PropTypes.func.isRequired,
	onSwapEdge: PropTypes.func.isRequired,
	onDeleteEdge: PropTypes.func.isRequired,
	canDeleteNode: PropTypes.func,
	canCreateEdge: PropTypes.func,
	canDeleteEdge: PropTypes.func,
	renderEdge: PropTypes.func,
	renderNode: PropTypes.func,
	renderDefs: PropTypes.func,
	renderBackground: PropTypes.func,
	readOnly: PropTypes.bool,
	enableFocus: PropTypes.bool,
	maxTitleChars: PropTypes.number, // Per line.
	transitionTime: PropTypes.number, // D3 Enter/Exit duration
	primary: PropTypes.string,
	light: PropTypes.string,
	dark: PropTypes.string,
	background: PropTypes.string,
	style: PropTypes.object,
	gridSize: PropTypes.number, // The point grid is fixed
	gridSpacing: PropTypes.number,
	gridDot: PropTypes.number,
	minZoom: PropTypes.number,
	maxZoom: PropTypes.number,
	nodeSize: PropTypes.number,
	edgeHandleSize: PropTypes.number,
	edgeArrowSize: PropTypes.number,
	zoomDelay: PropTypes.number, // ms
	zoomDur: PropTypes.number, // ms
	graphControls: PropTypes.bool,
};

GraphView.defaultProps = {
	selected: null,
	readOnly: false,
	maxTitleChars: 9,
	transitionTime: 150,
	primary: 'dodgerblue',
	light: '#FFF',
	dark: '#000',
	background: '#F9F9F9',
	gridSize: 40960, // The point grid is fixed
	gridSpacing: 36,
	gridDot: 2,
	minZoom: 0.15,
	maxZoom: 1.5,
	nodeSize: 150,
	edgeHandleSize: 50,
	edgeArrowSize: 8,
	zoomDelay: 500,
	zoomDur: 750,
	graphControls: true,
	renderEdge: (graphView, domNode, datum, index, elements) => {
		// For new edges, add necessary child domNodes
		if (!domNode.hasChildNodes()) {
			d3.select(domNode).append('path');
			d3.select(domNode).append('use');
		}

		const style = graphView.getEdgeStyle(datum, graphView.props.selected);
		const trans = graphView.getEdgeHandleTransformation(datum);

		if (trans) {
			d3.select(domNode)
				.attr('style', style)
				.select('use')
				.attr('xlink:href', d => graphView.props.edgeTypes[d.type].shapeId)
				.attr('width', graphView.props.edgeHandleSize)
				.attr('height', graphView.props.edgeHandleSize)
				.attr('transform', trans);

			d3.select(domNode)
				.select('path')
				.attr('d', graphView.getPathDescription);
		}
	},
	renderNode: (graphView, domNode, datum, index, elements) => {
		// For new nodes, add necessary child domNodes
		const selection = d3.select(domNode);
		if (!domNode.hasChildNodes()) {
			selection.append('use').classed('subtypeShape', true)
				.attr('x', -graphView.props.nodeSize / 2)
				.attr('y', -graphView.props.nodeSize / 2)
				.attr('width', graphView.props.nodeSize)
				.attr('height', graphView.props.nodeSize);
			selection.append('use').classed('shape', true)
				.attr('x', -graphView.props.nodeSize / 2)
				.attr('y', -graphView.props.nodeSize / 2)
				.attr('width', graphView.props.nodeSize)
				.attr('height', graphView.props.nodeSize);
		}

		const style = graphView.getNodeStyle(datum, graphView.props.selected);

		selection
			.attr('style', style);

		if (datum.subtype) {
			selection.select('use.subtypeShape')
				.attr('xlink:href', d => graphView.props.nodeSubtypes[d.subtype].shapeId);
		} else {
			selection.select('use.subtypeShape')
				.attr('xlink:href', d => null);
		}

		selection.select('use.shape')
			.attr('xlink:href', d => graphView.props.nodeTypes[d.type].shapeId);

		selection.attr('id', `node-${datum[graphView.props.nodeKey]}`);

		graphView.renderNodeText(datum, domNode);

		selection.attr('transform', graphView.getNodeTransformation);
	},
	renderDefs: (graphView) => {
		const { styles } = graphView.state;
		const {
			edgeArrowSize,
			gridSpacing,
			gridDot,
			nodeTypes,
			nodeSubtypes,
			edgeTypes,
		} = graphView.props;

		let defIndex = 0;
		const graphConfigDefs = [];

		Object.keys(nodeTypes).forEach((type) => {
			defIndex += 1;
			graphConfigDefs.push(React.cloneElement(nodeTypes[type].shape, { key: defIndex }));
		});

		Object.keys(nodeSubtypes).forEach((type) => {
			defIndex += 1;
			graphConfigDefs.push(React.cloneElement(nodeSubtypes[type].shape, { key: defIndex }));
		});

		Object.keys(edgeTypes).forEach((type) => {
			defIndex += 1;
			graphConfigDefs.push(React.cloneElement(edgeTypes[type].shape, { key: defIndex }));
		});

		return (
			<defs>
				{graphConfigDefs}

				<marker
					id="end-arrow"
					key="end-arrow"
					viewBox={`0 -${edgeArrowSize / 2} ${edgeArrowSize} ${edgeArrowSize}`}
					refX={`${edgeArrowSize / 2}`}
					markerWidth={`${edgeArrowSize}`}
					markerHeight={`${edgeArrowSize}`}
					orient="auto"
				>
					<path
						style={styles.arrow}
						d={`M0,-${edgeArrowSize / 2}L${edgeArrowSize},0L0,${edgeArrowSize / 2}`}
					 />
				</marker>

				<pattern
					id="grid"
					key="grid"
					width={gridSpacing}
					height={gridSpacing}
					patternUnits="userSpaceOnUse"
				>
					<circle
						cx={gridSpacing / 2}
						cy={gridSpacing / 2}
						r={gridDot}
						fill="lightgray"
					/>
				</pattern>

				<filter id="dropshadow" key="dropshadow" height="130%">
					<feGaussianBlur in="SourceAlpha" stdDeviation="3" />
					<feOffset dx="2" dy="2" result="offsetblur" />
					<feComponentTransfer>
						<feFuncA type="linear" slope="0.1" />
					</feComponentTransfer>
					<feMerge>
						<feMergeNode />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>

			</defs>
		);
	},
	renderBackground: graphView => (
		<rect
			className="background"
			x={-graphView.props.gridSize / 4}
			y={-graphView.props.gridSize / 4}
			width={graphView.props.gridSize}
			height={graphView.props.gridSize}
			fill="url(#grid)"
		 />
	),
	canDeleteNode: () => true,
	canCreateEdge: () => true,
	canDeleteEdge: () => true,
};

export default Radium(GraphView);

