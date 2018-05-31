import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core//TextField';
import ModalDialog from './ModalDialog';

class FieldListForm extends React.Component {
	constructor(props) {
		super(props);

		// Set up the state of the component
		this.state = {
			// Store the form data
			data: this.props.data,
			// Whether the data has changed (by default it hasn't)
			hasDataChanged: false,
			// Whether the cancel confirmation dialog is open (by default it isn't)
			cancelConfirmationDialogIsOpen: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		// Store the form data
		this.setState({
			data: nextProps.data,
		});
	}

	onUpdateFormField = (formFieldKey, formFieldValue) => {
		// Get a copy of the form data
		const data = { ...this.state.data };

		// Set the value of the form data based on the key
		data[formFieldKey] = formFieldValue;

		// Record the updated form data in our state and notify that data has
		// been modified
		this.setState(
			{
				data,
				hasDataChanged: true,
			},
			() => this.props.onDataModified(),
		);
	}

	onCancel = () => {
		// Has the data changed?
		if (this.state.hasDataChanged) {
			// Ask the user if they're sure they want to cancel
			this.setState({ cancelConfirmationDialogIsOpen: true });
		} else {
			// Just cancel
			this.props.onCancel();
		}
	}

	onCancelConfirmationDialogOK = () => {
		// Close the cancel confirmation dialog and cancel
		this.setState(
			{ cancelConfirmationDialogIsOpen: false },
			() => this.props.onCancel(),
		);
	}

	onCancelConfirmationDialogCancel = () => {
		// Close the cancel confirmation dialog
		this.setState({ cancelConfirmationDialogIsOpen: false });
	}

	render() {
		// The form fields
		let fields = [];

		// Do we have data?
		if (this.state.data) {
			// Build the fields using the schema
			fields = this.props.schema.map(field => (<TextField
				key={field.fieldName}
				id={field.fieldName}
				label={field.label}
				fullWidth
				readOnly={field.readOnly}
				multiline={field.multiline}
				value={this.state.data[field.fieldName]}
				onChange={event => this.onUpdateFormField(field.fieldName, event.target.value)}
			/>));
		}

		return (
			<ModalDialog
				onOK={() => this.props.onOK(this.props.dataKeyValue, this.state.data)}
				onCancel={this.onCancel}
				title={this.props.title}
				open={this.props.open}
			>
				<ModalDialog
					onOK={this.onCancelConfirmationDialogOK}
					onCancel={this.onCancelConfirmationDialogCancel}
					title="Warning!"
					open={this.state.cancelConfirmationDialogIsOpen}
					okButtonLabel="Yes"
					cancelButtonLabel="No"
				>
					Changes will be lost, are you sure you want to close this dialog?
				</ModalDialog>
				{fields}
			</ModalDialog>
		);
	}
}

FieldListForm.propTypes = {
	onDataModified: PropTypes.func.isRequired,
	onOK: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,

	title: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	addModeEnabled: PropTypes.bool.isRequired, // eslint-disable-line
	schema: PropTypes.array.isRequired,
	dataKeyValue: PropTypes.any,
	data: PropTypes.object,
};

FieldListForm.defaultProps = {
	dataKeyValue: '',
	data: null,
};

export default FieldListForm;
