import React from 'react';
import TextField from '@material-ui/core//TextField';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core//styles';
import themes from '../themes';
import ModalDialog from '../../general/components/ModalDialog';

class InsertNodeIntoNode extends React.Component {
	render() {
		return (
			<ModalDialog
				title="Insert Node"
				open={this.props.open}
				onCancel={this.props.onCancel}
				onOK={this.props.onOK}
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
