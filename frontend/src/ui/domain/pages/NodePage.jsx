import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import NodeEditor from '../modals/NodeEditor';
import themes from '../themes';

class NodePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			nodeEditorOpen: false,
			nodes: [
				{
					id: 1,
					name: 'StartRoom',
					section: 'Easy',
					tags: 'Easy, Name',
				},
				{
					id: 2,
					name: 'StartRoom',
					section: 'Easy',
					tags: 'Easy, Name',
				},
				{
					id: 3,
					name: 'StartRoom',
					section: 'Easy',
					tags: 'Easy, Name',
				},
			],
		};

		// Bind our events
		this.showNodeEditor = this.showNodeEditor.bind(this);
		this.hideNodeEditor = this.hideNodeEditor.bind(this);
	}

	getNodeRows() {
		let rows = [];

		if (this.state.nodes) {
			rows = this.state.nodes.map(node => (<TableRow key={node.name}>
				<TableCell>{node.section}</TableCell>
				<TableCell>{node.name}</TableCell>
				<TableCell>{node.tags}</TableCell>
			</TableRow>));
		}

		return (rows);
	}

	showNodeEditor() {
		this.setState({ nodeEditorOpen: true });
		console.log('test');
	}

	hideNodeEditor() {
		this.setState({ nodeEditorOpen: false });
		console.log('test');
	}

	render() {
		return (
			<div>
				<NodeEditor open={this.state.nodeEditorOpen} handleClose={this.hideNodeEditor} />
				<Button size="large" onClick={this.showNodeEditor}>Add Node</Button>
				<Button size="large" onClick={this.showNodeEditor}>Edit Node</Button>
				<Button size="large" onClick={this.showNodeEditor}>Delete Selected Nodes</Button>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Kris</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Tags</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ this.getNodeRows() }
					</TableBody>
				</Table>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(NodePage);
