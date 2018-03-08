import React from 'react';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import themes from '../themes';
import ModalDialog from '../../general/components/ModalDialog';

class InsertCharacterCallToNode extends React.Component {
	render() {
		return (
			<ModalDialog
				title="Insert Character"
				open={this.props.open}
				handleCancel={this.props.handleCancel}
				handleOk={this.props.handleOk}
			>
				<div>Need to do some sort of lookup for this</div>
				<TextField
					id="character-name"
					label="Name"
					fullWidth
				/>
				<TextField
					id="character-description"
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

export default withStyles(themes.defaultTheme)(InsertCharacterCallToNode);
