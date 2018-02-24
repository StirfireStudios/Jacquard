import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import NodeEditor from '../modals/NodeEditor';
import themes from '../themes';

class Nodes extends React.Component {
	constructor(props) {
		super(props);

		this.state = { nodeEditorOpen: false };

		// Bind our events
		this.showNodeEditor = this.showNodeEditor.bind(this);
		this.hideNodeEditor = this.hideNodeEditor.bind(this);
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
				<NodeEditor open={this.state.nodeEditorOpen} close={this.hideNodeEditor} />
				<Button size="large" onClick={this.showNodeEditor}>Add Node</Button>
				<Button size="large" onClick={this.showNodeEditor}>Edit Node</Button>
				<Button size="large" onClick={this.showNodeEditor}>Delete Selected Nodes</Button>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Section</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Tags</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>Easy</TableCell>
							<TableCell>StartRoom</TableCell>
							<TableCell>Easy, Start</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Easy</TableCell>
							<TableCell>Name-Paul</TableCell>
							<TableCell>Easy, Name</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Easy</TableCell>
							<TableCell>Name-George</TableCell>
							<TableCell>Easy, Name</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Easy</TableCell>
							<TableCell>Name-Dolores</TableCell>
							<TableCell>Easy, Name</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(Nodes);
