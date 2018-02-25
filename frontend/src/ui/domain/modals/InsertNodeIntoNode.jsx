import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import themes from '../themes';
import ModalDialog from '../../general/components/ModalDialog';

class InsertNodeIntoNode extends React.Component {
	render() {
		return (
			<ModalDialog
				title="Insert Node"
				open={this.props.open}
				handleClose={this.props.handleClose}
			>
				<div>Need to do some sort of lookup for this</div>
				<TextField
					id="node-name"
					label="Name"
					fullWidth
				/>
				<div>
					Maybe we need to show other things about the node?
					Perhaps the tags etc.?
				</div>
				<TextField
					id="node-description"
					label="Description"
					readOnly
					fullWidth
					multiline
					rows="4"
				/>
				<Button>List</Button>
			</ModalDialog>
		);
	}
}

export default withStyles(themes.defaultTheme)(InsertNodeIntoNode);
