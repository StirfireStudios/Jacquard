import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import themes from '../themes';
import ModalDialog from '../../general/components/ModalDialog';

class InsertVariableIntoNode extends React.Component {
	render() {
		return (
			<ModalDialog
				title="Insert Variable"
				open={this.props.open}
				handleCancel={this.props.handleCancel}
				handleOk={this.props.handleOk}
			>
				<div>Need to do some sort of lookup for this</div>
				<TextField
					id="variable-name"
					label="Name"
					fullWidth
				/>
				<TextField
					id="variable-description"
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

export default withStyles(themes.defaultTheme)(InsertVariableIntoNode);
