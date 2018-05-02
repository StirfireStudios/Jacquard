import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import ModalDialog from './ModalDialog';

class FieldListForm extends React.Component {
	render() {
		let fields = [];

		if (this.props.data) {
			fields = this.props.formSchema.map(field => (<TextField
				key={field.fieldName}
				id={field.fieldName}
				label={field.label}
				fullWidth
				readOnly={field.readOnly}
				multiline={field.multiline}
				value={this.props.data[field.fieldName]}
				onChange={(e) => { this.props.onUpdateFormField(e, field.fieldName); }}
			/>));
		}

		return (
			<ModalDialog
				title={this.props.title}
				open={this.props.open}
				onCancel={this.props.onCancel}
				onSave={this.props.onSave}
			>
				{fields}
			</ModalDialog>
		);
	}
}

FieldListForm.defaultProps = {
	data: null,
};

FieldListForm.propTypes = {
	title: PropTypes.string.isRequired,
	data: PropTypes.object,
	formSchema: PropTypes.array.isRequired,
	open: PropTypes.bool.isRequired,
	onUpdateFormField: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default FieldListForm;
