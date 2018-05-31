import React from 'react';
import { withStyles } from '@material-ui/core//styles';
import TextField from '@material-ui/core//TextField';
import Button from '@material-ui/core//Button';
import themes from '../themes';
import ModalDialog from '../../general/components/ModalDialog';

class InsertCharacterCallToNode extends React.Component {
	render() {
		return (
			<ModalDialog
				title="Insert Character"
				open={this.props.open}
				onCancel={this.props.onCancel}
				onOK={this.props.onOK}
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
