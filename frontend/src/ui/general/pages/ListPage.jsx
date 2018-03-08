import React from 'react';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
// import ListEditButton from '../../general/components/ListEditButton';
// import ListDeleteButton from '../../general/components/ListDeleteButton';
import currentProjectService from '../../../services/currentProjectService';
import FieldListTable from '../components/FieldListTable';
import FieldListForm from '../components/FieldListForm';

// @description State is stored at this level.
// Assumes that you are going to have a list of some sort that you can edit.
// Takes a list of fields that you want to show, a form that will act as the add/edit form and
// the name of the array from currentProject that you want to deal with

class ListPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentProject: {},
			addEditFormOpen: false,
			formData: null,
			formTitle: '',
		};
	}

	componentWillMount() {
		const currentProject = currentProjectService.get();
		this.setState({ currentProject });
	}

	onAddItemClick = () => {
		this.openAddEditForm(this.props.addFormTitle, this.createNewFormData());
	};

	onEditItemClick = (keyValue) => {
		const currentProject = currentProjectService.get();

		const rowData = currentProject[this.props.currentProjectPropName];

		const formData = {};
		rowData.forEach((row) => {
			if (row[this.props.keyName] === keyValue) {
				this.setFieldsBasedOnFormSchema(row, formData);
			}
		});

		this.openAddEditForm(this.props.editFormTitle, formData);
	};

	onDeleteItemClick = (keyValue) => {
		const currentProject = currentProjectService.get();

		const rowData = currentProject[this.props.currentProjectPropName];

		const filteredRowData = rowData.filter(row => row[this.props.keyName] !== keyValue);

		currentProject[this.props.currentProjectPropName] = filteredRowData;

		currentProjectService.set(currentProject);

		this.setState({ currentProject });
	};

	// TODO: Move to a helper function
	onUpdateFormField = (event, key) => {
		const { formData } = this.state;
		formData[key] = event.target.value;
		this.setState({	formData });
	}

	onAddEditFormOk = () => {
		const currentProject = currentProjectService.get();

		const rowData = currentProject[this.props.currentProjectPropName];

		let rowToUpdate = null;

		rowData.forEach((row) => {
			if (row[this.props.keyName] === this.state.formData[this.props.keyName]) {
				rowToUpdate = row;
				this.setFieldsBasedOnFormSchema(this.state.formData, rowToUpdate);
			}
		});

		// If we didn't find a row to update, just push the form data onto the array as
		// it's a new row.
		// TODO: we should probably clean this up so it matches a schema definition somewhere.
		// Might not necessarily be the formField schema
		if (rowToUpdate === null) {
			rowData.push(this.state.formData);
		}

		currentProjectService.set(currentProject);

		this.setState({ currentProject });

		this.closeAddEditForm();
	}

	onAddEditFormCancel = () => {
		this.closeAddEditForm();
	}

	setFieldsBasedOnFormSchema = (source, dest) => {
		this.props.formSchema.forEach((formField) => {
			dest[formField.fieldName] = source[formField.fieldName];
		});
	};

	getRows = () => this.state.currentProject[this.props.currentProjectPropName];

	openAddEditForm = (title, data) => {
		this.setState({
			formTitle: title,
			formData: data,
			addEditFormOpen: true,
		});
	}

	closeAddEditForm = () => {
		this.setState({
			addEditFormOpen: false,
		});
	}

	createNewFormData = () => {
		const formData = {};

		this.props.formSchema.forEach((formField) => { formData[formField.fieldName] = ''; });

		return formData;
	}

	render() {
		return (
			<div>
				<Button
					onClick={this.onAddItemClick}
					variant="raised"
					color="primary"
				>
					Add
				</Button>
				<FieldListForm
					data={this.state.formData}
					formSchema={this.props.formSchema}
					open={this.state.addEditFormOpen}
					onUpdateFormField={this.onUpdateFormField}
					onOk={this.onAddEditFormOk}
					onCancel={this.onAddEditFormCancel}
					title={this.state.formTitle}
				/>
				<FieldListTable
					rows={this.getRows()}
					fieldNames={this.props.fieldNames}
					displayNames={this.props.displayNames}
					keyName={this.props.keyName}
					onEditClick={this.onEditItemClick}
					onDeleteClick={this.onDeleteItemClick}
				/>
			</div>
		);
	}
}

ListPage.propTypes = {
	// editFormTitle: PropTypes.string.isRequired,
	addFormTitle: PropTypes.string.isRequired,
	currentProjectPropName: PropTypes.string.isRequired,
	keyName: PropTypes.string.isRequired,
	fieldNames: PropTypes.array.isRequired,
	displayNames: PropTypes.array.isRequired,
	formSchema: PropTypes.array.isRequired,
};

export default ListPage;
