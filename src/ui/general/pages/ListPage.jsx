import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core//Button';
import { Typography } from '@material-ui/core';
import green from '@material-ui/core//colors/green';

// import ListEditButton from '../../general/components/ListEditButton';
// import ListDeleteButton from '../../general/components/ListDeleteButton';
import FieldListTable from '../components/FieldListTable';

import ModalDialog from '../../general/components/ModalDialog';


// Assumes that you are going to have a list of some sort that you can edit.
// Takes a list of fields that you want to show, a form that will act as the add/edit form and
// the name of the array from project that you want to deal with

const styles = theme => ({
	fab: {
		position: 'absolute',
		zIndex: 10,
		bottom: theme.spacing.unit * 4,
		right: theme.spacing.unit * 4,
		color: theme.palette.common.white,
		backgroundColor: green[500],
	},
});

function deleteItemConfirm(keyPath) {
	const project = { ...this.props.project };
	const rowData = project[this.props.projectPropName];
	const filteredRowData = rowData.filter(row => row[this.props.keyName] !== keyPath);
	project[this.props.projectPropName] = filteredRowData;
	this.props.onProjectUpdated(project);
	this.setState({ deleteModalItem: null	});
}

function typeName(type, capitalize) {
	if (capitalize) return "Node";
	return "node";
}

function renderDeleteConfirmModal() {
	if (this.state.deleteModalItem === null) return null;
	const keyPath = this.state.deleteModalItem;
	const typeNameUpper = typeName(this.props.projectPropName, true);
	const typeNameLower = typeName(this.props.projectPropName);
	return (
		<ModalDialog
			onOK={deleteItemConfirm.bind(this, keyPath)}
			onCancel={() => this.setState({deleteModalItem: null})}
<<<<<<< HEAD
			title={`Confirm Node Deletion`}
=======
			title={`Confirm ${typeNameUpper} Deletion`}
>>>>>>> develop
			open={true}
			okButtonLabel="Yes, I'm sure"
			cancelButtonLabel="Cancel"
		>
<<<<<<< HEAD
			<div>Are you sure you want to delete the "{keyPath}" node? There's no undo button for this!</div>
=======
			<Typography>Are you sure you want to delete the "{keyPath}" {typeNameLower}? There's no undo button for this!</Typography>
>>>>>>> develop
		</ModalDialog>
	);
}

class ListPage extends React.Component {
	constructor(props) {
		super(props);

		// Initialize the state of the component
		this.state = {
			// The Add/Edit form is initially closed
			addEditFormOpen: false,
			// Whether the Add/Edit form is in Add mode (it's in Edit mode otherwise)
			addEditFormAddModeEnabled: true,
			// The value referenced by the key of the Add/Edit forms data
			addEditFormDataKeyValue: null,
			deleteModalItem: null,
		};

		// Bind our handlers
		this.onAddItemClick = this.onAddItemClick.bind(this);
		this.onEditItemClick = this.onEditItemClick.bind(this);

		this.onAddEditFormOK = this.onAddEditFormOK.bind(this);
		this.onAddEditFormCancel = this.onAddEditFormCancel.bind(this);
	}

	onAddItemClick = (newItemKeyValue) => {
		// Open the form in Add mode and record the key value
		this.setState({
			addEditFormOpen: true,
			addEditFormAddModeEnabled: true,
			addEditFormDataKeyValue: newItemKeyValue,
		});
	};

	onEditItemClick = (keyValue) => {
		// Open the form in Edit mode and record the key value
		this.setState({
			addEditFormOpen: true,
			addEditFormAddModeEnabled: false,
			addEditFormDataKeyValue: keyValue,
		});
	};

	onAddEditFormOK = (addEditFormDataPreviousKeyValue, addEditFormUpdatedData) => {
		// Get a copy of the project
		const project = { ...this.props.project };

		// Get the row data we'll be updating
		const rowData = project[this.props.projectPropName];

		// Is Add mode enabled?
		if (this.state.addEditFormAddModeEnabled) {
			// Add the form data to the projects row data
			addEditFormUpdatedData.dirty = true;
			rowData.push(addEditFormUpdatedData);
		} else {
			// Get the index of the row we'll be updating
			// We look up the row using the previous value of the key, since it
			// might have been changed during editing
			const rowToUpdateIndex = rowData
				.findIndex(row =>
					row[this.props.keyName] === addEditFormDataPreviousKeyValue);

			// If we found the row, update it
			if (rowToUpdateIndex !== -1) {
				// Get the row to update
				const rowToUpdate = rowData[rowToUpdateIndex];

				// Update the row fields from the form data according to the form schema
				this.setFieldsBasedOnFormSchema(addEditFormUpdatedData, rowToUpdate);
				rowToUpdate.dirty = true;
			}
		}

		// Notify the callback that the project has changed
		this.props.onProjectUpdated(project);

		// Close the Add/Edit form
		this.closeAddEditForm();
	}

	onAddEditFormCancel = () => {
		this.closeAddEditForm();
	}

	setFieldsBasedOnFormSchema = (source, dest) => {
		this.props.addEditFormSchema.forEach((formField) => {
			dest[formField.fieldName] = source[formField.fieldName];
		});
	}

	/* eslint no-confusing-arrow: ["error", {"allowParens": true}] */
	getProjectProp = () => {
		const projectProp = (this.props.project)
			? this.props.project[this.props.projectPropName]
			: [];

		return projectProp.filter(prop => !this.props.projectPropNameHiddenStates[prop.title]);
	};

	closeAddEditForm = () => {
		this.setState({
			addEditFormOpen: false,
		});
	}

	createNewAddEditFormData = () =>
		// Set up an empty field for each field in the form schema
		this.props.addEditFormSchema.reduce((addEditFormData, addEditFormField) => {
			addEditFormData[addEditFormField.fieldName] = '';
			return addEditFormData;
		}, {});

	render() {
		// Get the Add/Edit form component
		const AddEditForm = this.props.addEditForm;

		// The title of the Add/Edit form
		let addEditFormTitle = '';

		// The Add/Edit form data
		let addEditFormData = null;

		// Are we adding an item?
		if (this.state.addEditFormAddModeEnabled) {
			// Set the Add/Edit form title
			addEditFormTitle = this.props.addEditFormAddTitle;

			// Create new Add/Edit form data
			addEditFormData = this.createNewAddEditFormData();

			// Set the key value of the new item (if we have one)
			addEditFormData[this.props.keyName] = this.state.addEditFormDataKeyValue || '';
		} else {
			// Set the Add/Edit form title
			addEditFormTitle = this.props.addEditFormEditTitle;

			// Get a copy of the row data we'll be editing
			const rowData = [...this.props.project[this.props.projectPropName]];

			// Generate the form data from the row data
			addEditFormData = rowData.reduce((formData, row) => {
				if (row[this.props.keyName] === this.state.addEditFormDataKeyValue) {
					this.setFieldsBasedOnFormSchema(row, formData);
				}

				return formData;
			}, {});
		}

		return (
			<div>
				{renderDeleteConfirmModal.call(this)}
				<Button
					className={this.props.classes.fab}
					variant="fab"
					color="inherit"
					onClick={() => this.onAddItemClick('')}
				>
					<AddIcon />
				</Button>
				<AddEditForm
					onAddItemClick={() => this.onAddItemClick('')}
					onEditItemClick={this.onEditItemClick}
					onDataModified={this.props.onDataModified}
					onOK={this.onAddEditFormOK}
					onCancel={this.onAddEditFormCancel}
					title={addEditFormTitle}
					open={this.state.addEditFormOpen}
					addModeEnabled={this.state.addEditFormAddModeEnabled}
					schema={this.props.addEditFormSchema}
					dataKeyValue={this.state.addEditFormDataKeyValue}
					data={addEditFormData}
				/>
				<FieldListTable
					rows={this.getProjectProp()}
					fields={this.props.fields}
					keyName={this.props.keyName}
					onAddItemClick={() => this.onAddItemClick('')}
					onEditItemClick={this.onEditItemClick}
					onDeleteItemClick={(keyValue) => { this.setState({deleteModalItem: keyValue}) }}
				/>
			</div>
		);
	}
}

ListPage.propTypes = {
	onProjectUpdated: PropTypes.func.isRequired,
	onDataModified: PropTypes.func.isRequired,

	project: PropTypes.object,
	projectPropName: PropTypes.string.isRequired,
	projectPropNameHiddenStates: PropTypes.object,

	addEditForm: PropTypes.func.isRequired,
	addEditFormEditTitle: PropTypes.string.isRequired,
	addEditFormAddTitle: PropTypes.string.isRequired,
	addEditFormSchema: PropTypes.array.isRequired,
	keyName: PropTypes.string.isRequired,
	fields: PropTypes.array.isRequired,
};

ListPage.defaultProps = {
	project: null,
	projectPropNameHiddenStates: {},
};

export default withStyles(styles, { withTheme: true })(ListPage);
