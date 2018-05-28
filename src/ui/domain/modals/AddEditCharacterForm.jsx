import React from 'react';
import { withStyles } from '@material-ui/core//styles';
import TextField from '@material-ui/core//TextField';
import themes from '../themes';
import ModalDialog from '../../general/components/ModalDialog';

class AddEditCharacterForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleOk() {
		if (this.props.handleOk) {
			this.props.handleOk();
		}
	}

	handleCancel() {
		if (this.props.handleCancel) {
			this.props.handleCancel();
		}
	}

	render() {
		return (
			<ModalDialog
				title="Add/Edit Character"
				open={this.props.open}
				handleCancel={this.handleCancel}
				handleOk={this.handleOk}
			>
				<TextField
					id="character-name"
					label="Name"
					fullWidth
					readOnly="false"
					value={this.props.data.name}
					onChange={this.props.onNameChange}
				/>
				<TextField
					id="character-description"
					label="Description"
					readOnly="false"
					fullWidth
					multiline
					rows="4"
					value={this.props.data.description}
					onChange={this.props.onDescriptionChange}
				/>
			</ModalDialog>
		);
	}
}

export default withStyles(themes.defaultTheme)(AddEditCharacterForm);
