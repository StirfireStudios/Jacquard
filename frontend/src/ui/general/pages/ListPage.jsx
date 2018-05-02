import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AddIcon from '@material-ui/icons/Add';
import green from 'material-ui/colors/green';

// import ListEditButton from '../../general/components/ListEditButton';
// import ListDeleteButton from '../../general/components/ListDeleteButton';
import FieldListTable from '../components/FieldListTable';

// Assumes that you are going to have a list of some sort that you can edit.
// Takes a list of fields that you want to show, a form that will act as the add/edit form and
// the name of the array from currentProject that you want to deal with

const styles = theme => ({
	fab: {
		position: 'absolute',
		bottom: theme.spacing.unit * 4,
		right: theme.spacing.unit * 4,
		color: theme.palette.common.white,
		backgroundColor: green[500],
	},
});

class ListPage extends React.Component {
	constructor(props) {
		super(props);

		// Initialize the state of the component
		this.state = {
			// The Add/Edit form is initially closed
			addEditFormOpen: false,
			// Whether the Add/Edit form is in Add mode (it's in Edit mode otherwise)
			addEditFormAddModeEnabled: true,
			// We don't have any form data yet
			addEditFormData: null,
			// The previous value of the key before the form data was updated
			// (initially null)
			addEditFormDataPreviousKeyValue: null,
		};
	}

	onAddItemClick = (newItemKeyValue) => {
		// Create new Add/Edit form data
		const newFormData = this.createNewAddEditFormData();

		// Set the key value of the new item
		newFormData[this.props.keyName] = newItemKeyValue || '';

		// Open the form in Add mode
		this.openAddForm(newFormData);
	};

	onEditItemClick = (keyValue) => {
		// Get a copy of the current project
		const currentProject = { ...this.props.currentProject };

		// Get the row data we'll be editing
		const rowData = currentProject[this.props.currentProjectPropName];

		// Generate the form data from the row data
		const addEditFormData = {};
		rowData.forEach((row) => {
			if (row[this.props.keyName] === keyValue) {
				this.setFieldsBasedOnFormSchema(row, addEditFormData);
			}
		});

		// Open the form in Edit mode
		this.openEditForm(addEditFormData);
	};

	onDeleteItemClick = (keyValue) => {
		// Get a copy of the current project
		const currentProject = { ...this.props.currentProject };

		// Get the row data we'll be deleting from
		const rowData = currentProject[this.props.currentProjectPropName];

		// Delete the item
		const filteredRowData = rowData.filter(row => row[this.props.keyName] !== keyValue);

		// Update the current project with the new row data
		currentProject[this.props.currentProjectPropName] = filteredRowData;

		// Notify the callback that the current project has changed
		this.props.onCurrentProjectChanged(currentProject);
	};

	// TODO: Move to a helper function
	onUpdateFormField = (event, key) => {
		// Get a copy of the form data
		const addEditFormData = { ...this.state.addEditFormData };

		// Set the value of the form data based on the key
		addEditFormData[key] = event.target.value;

		// Record the updated form data in our state
		this.setState({	addEditFormData });
	}

	onAddEditFormSave = () => {
		// Get a copy of the current project
		const currentProject = { ...this.props.currentProject };

		// Get the row data we'll be updating
		const rowData = currentProject[this.props.currentProjectPropName];

		// Is Add mode enabled?
		if (this.state.addEditFormAddModeEnabled) {
			// Add the form data to the current projects row data
			rowData.push(this.state.addEditFormData);
		} else {
			// Get the index of the row we'll be updating
			// We look up the row using the previous value of the key, since it
			// might have been changed during editing
			const rowToUpdateIndex = rowData
				.findIndex(row =>
					row[this.props.keyName] === this.state.addEditFormDataPreviousKeyValue);

			// If we found the row, update it
			if (rowToUpdateIndex !== -1) {
				// Get the row to update
				const rowToUpdate = rowData[rowToUpdateIndex];

				// Update the row fields from the form data according to the form schema
				this.setFieldsBasedOnFormSchema(this.state.addEditFormData, rowToUpdate);
			}
		}

		// Notify the callback that the current project has changed
		this.props.onCurrentProjectChanged(currentProject);

		// Close the Add/Edit form
		this.closeAddEditForm();
	}

	onAddEditFormCancel = () => {
		this.closeAddEditForm();
	}

	setFieldsBasedOnFormSchema = (source, dest) => {
		this.props.formSchema.forEach((formField) => {
			dest[formField.fieldName] = source[formField.fieldName];
		});
	}

	/* eslint no-confusing-arrow: ["error", {"allowParens": true}] */
	getCurrentProjectProp = () => (
		this.props.currentProject
			? this.props.currentProject[this.props.currentProjectPropName]
			: []
	);

	openAddForm = (addEditFormData) => {
		this.setState({
			addEditFormOpen: true,
			addEditFormAddModeEnabled: true,
			addEditFormData,
			addEditFormDataPreviousKeyValue: null,
		});
	}

	openEditForm = (addEditFormData) => {
		// Get the key value from the Add/Edit form data
		// We'll use this to be able to match the row being edited even if the
		// key value changes
		const addEditFormDataPreviousKeyValue = addEditFormData[this.props.keyName];

		this.setState({
			addEditFormOpen: true,
			addEditFormAddModeEnabled: false,
			addEditFormData,
			addEditFormDataPreviousKeyValue,
		});
	}

	closeAddEditForm = () => {
		this.setState({
			addEditFormOpen: false,
		});
	}

	createNewAddEditFormData = () =>
		// Set up an empty field for each field in the form schema
		this.props.formSchema.reduce((addEditFormData, addEditFormField) => {
			addEditFormData[addEditFormField.fieldName] = '';
			return addEditFormData;
		}, {});

	render() {
		// Get the Add/Edit form component
		const AddEditForm = this.props.addEditForm;

		// Determine the title of the Add/Edit form base on whether we have
		// any form data
		const addEditFormTitle = (this.state.addEditFormAddModeEnabled)
			? this.props.addFormTitle
			: this.props.editFormTitle;

		return (
			<div>
				<Button
					className={this.props.classes.fab}
					variant="fab"
					color="inherit"
					onClick={this.onAddItemClick}
				>
					<AddIcon />
				</Button>
				<AddEditForm
					title={addEditFormTitle}
					projectFilePath={this.props.currentProjectFilePath}
					data={this.state.addEditFormData}
					open={this.state.addEditFormOpen}
					onAddItemClick={this.onAddItemClick}
					onEditItemClick={this.onEditItemClick}
					onUpdateFormField={this.onUpdateFormField}
					onSave={this.onAddEditFormSave}
					onCancel={this.onAddEditFormCancel}
					formSchema={this.props.formSchema}
				/>
				<FieldListTable
					rows={this.getCurrentProjectProp()}
					fields={this.props.fields}
					keyName={this.props.keyName}
					onAddItemClick={this.onAddItemClick}
					onEditItemClick={this.onEditItemClick}
					onDeleteItemClick={this.onDeleteItemClick}
				/>
			</div>
		);
	}
}

ListPage.propTypes = {
	onCurrentProjectChanged: PropTypes.func.isRequired,

	editFormTitle: PropTypes.string.isRequired,
	addFormTitle: PropTypes.string.isRequired,
	currentProject: PropTypes.object,
	currentProjectFilePath: PropTypes.string.isRequired,
	currentProjectPropName: PropTypes.string.isRequired,
	keyName: PropTypes.string.isRequired,
	fields: PropTypes.array.isRequired,
	formSchema: PropTypes.array.isRequired,
	addEditForm: PropTypes.func.isRequired,
};

ListPage.defaultProps = {
	currentProject: null,
};

export default withStyles(styles, { withTheme: true })(ListPage);
