import React from 'react';
import TextField from '@material-ui/core//TextField';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core//styles';
import themes from '../themes';
import ModalDialog from '../../general/components/ModalDialog';

class InsertFunctionCallIntoNode extends React.Component {
	render() {
		return (
			<ModalDialog
				title="Insert Function Call"
				open={this.props.open}
				onCancel={this.props.onCancel}
				onOK={this.props.onOK}
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
