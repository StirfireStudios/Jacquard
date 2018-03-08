import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import themes from '../themes';
import ModalDialog from '../../general/components/ModalDialog';

class InsertFunctionCallIntoNode extends React.Component {
	render() {
		return (
			<ModalDialog
				title="Insert Function Call"
				open={this.props.open}
				handleCancel={this.props.handleCancel}
				handleOk={this.props.handleOk}
			>
				<div>Need to do some sort of lookup for this</div>
				<div>
					How do we do the parameters? Are they stored as well? Do we let you
					type in function names and have the parameter list as a user defined
					variable lookup? Maybe `add parameter` and add a list of global
					variables or fixed strings to a list?
				</div>
				<TextField
					id="function-name"
					label="Name"
					fullWidth
				/>
				<TextField
					id="function-description"
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

export default withStyles(themes.defaultTheme)(InsertFunctionCallIntoNode);
