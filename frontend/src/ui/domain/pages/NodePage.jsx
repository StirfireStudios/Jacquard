import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import Icon from 'material-ui/Icon';
import List, { ListItem, ListItemText } from 'material-ui/List';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import red from 'material-ui/colors/red';
import orange from 'material-ui/colors/orange';
import green from 'material-ui/colors/green';

import uuidv4 from 'uuid/v4';

import ListPage from '../../general/pages/ListPage';
import fieldListItemContent from '../../general/utils/field-list-item-content';

import NodeEditorForm from '../modals/NodeEditorForm';

import yarnService from '../../../services/yarnService';

const styles = theme => ({
	errorIcon: {
		width: 48,
		height: 48,
		color: red[500],
	},
	warningIcon: {
		width: 48,
		height: 48,
		color: orange[500],
	},
	okIcon: {
		width: 48,
		height: 48,
		color: green[500],
	},
	nodeExistingLinkButton: {
		marginRight: theme.spacing.unit * 2,
	},
	nodeNonExistingLinkButton: {
		marginRight: theme.spacing.unit * 2,
		backgroundColor: red[500],
	},
});

const getIncomingLinkButtons = (projectNodeLinks, classes, item, field, onAddItemClick, onEditItemClick) => {
	// If we don't have project node links, return nothing
	if (!projectNodeLinks) {
		return [];
	}

	// Get the node links
	const nodeLinks = projectNodeLinks[item.title];

	// If we don't have any node links, return an empty array
	if (!nodeLinks) {
		return [];
	}

	// Build a button for each incoming link
	return Object.keys(nodeLinks.incomingLinks).map((incomingLinkKey) => {
		// Get the node
		const node = nodeLinks.incomingLinks[incomingLinkKey];

		// Figure out the button class
		const buttonClass = (node)
			? classes.nodeExistingLinkButton
			: classes.nodeNonExistingLinkButton;

		// Figure out the button on-click handler
		const buttonOnClick = (node)
			? () => onEditItemClick(node.name)
			: () => onAddItemClick(incomingLinkKey);

		return (
			<Button
				key={uuidv4()}
				className={buttonClass}
				variant="raised"
				onClick={buttonOnClick}
			>
				{incomingLinkKey}
			</Button>
		);
	});
};

const getOutgoingLinkButtons = (projectNodeLinks, classes, item, field, onAddItemClick, onEditItemClick) => {
	// If we don't have project node links, return nothing
	if (!projectNodeLinks) {
		return [];
	}

	// Get the node links
	const nodeLinks = projectNodeLinks[item.title];

	// If we don't have any node links, return an empty array
	if (!nodeLinks) {
		return [];
	}

	// Build a button for each outgoing link
	return Object.keys(nodeLinks.outgoingLinks).map((outgoingLinkKey) => {
		// Get the node
		const node = nodeLinks.outgoingLinks[outgoingLinkKey];

		// Figure out the button class
		const buttonClass = (node)
			? classes.nodeExistingLinkButton
			: classes.nodeNonExistingLinkButton;

		// Figure out the button on-click handler
		const buttonOnClick = (node)
			? () => onEditItemClick(node.name)
			: () => onAddItemClick(outgoingLinkKey);

		return (
			<Button
				key={uuidv4()}
				className={buttonClass}
				variant="raised"
				onClick={buttonOnClick}
			>
				{outgoingLinkKey}
			</Button>
		);
	});
};

const getValidationResultIcon = (projectValidationResults, classes, item) => {
	// If we don't have project validation results, return an empty result
	if (!projectValidationResults) {
		return null;
	}

	// Get the node validation results
	const nodeValidationResults = projectValidationResults.nodes[item.title];

	// If we don't have any node validation results, return an empty result
	if (!nodeValidationResults) {
		return null;
	}

	// The validation result icon
	let validationResultIcon = null;

	// Build an icon if the node has errors
	if (nodeValidationResults.errors.length > 0) {
		// Build the error icon tooltip (use only the first one)
		const errorIconTooltip = nodeValidationResults.errors[0].message;

		// Build the error icon
		const errorIcon = (
			<Tooltip key={uuidv4()} title={errorIconTooltip}>
				<ErrorIcon className={classes.errorIcon} />
			</Tooltip>
		);

		// Set it as the validation result icon
		validationResultIcon = errorIcon;
	} else if (nodeValidationResults.warnings.length > 0) {
		// Build the warning icon tooltip (use only the first one)
		const warningIconTooltip = nodeValidationResults.warnings[0].message;

		// Build the warning icon
		const warningIcon = (
			<Tooltip key={uuidv4()} title={warningIconTooltip}>
				<WarningIcon className={classes.warningIcon} />
			</Tooltip>
		);

		// Set it as the validation result icon
		validationResultIcon = warningIcon;
	} else {
		// Set the validation result icon to the OK icon
		validationResultIcon = <CheckCircleIcon className={classes.okIcon} />;
	}

	return validationResultIcon;
};

const renderGeneralValidationErrors = projectValidationResults =>
	// Build the validation errors
	projectValidationResults.generalErrors.map((validationError) => {
		// Build the location
		const location = yarnService.buildLocationString(validationError.location);

		return (
			<ListItem key={uuidv4()}>
				<Icon color="error">error</Icon>
				<ListItemText primary={validationError.message} secondary={location} />
			</ListItem>
		);
	});

const renderGeneralValidationWarnings = projectValidationResults =>
	// Build the validation warnings
	projectValidationResults.generalWarnings.map((validationWarning) => {
		// Build the location
		const location = yarnService.buildLocationString(validationWarning.location);

		return (
			<ListItem key={uuidv4()}>
				<Icon>warning</Icon>
				<ListItemText
					primary={validationWarning.message}
					secondary={location}
				/>
			</ListItem>
		);
	});

const renderGeneralValidationResults = (projectValidationResults) => {
	// Render the validation errors and warnings
	const validationErrors = renderGeneralValidationErrors(projectValidationResults);
	const validationWarnings = renderGeneralValidationWarnings(projectValidationResults);

	// The validation results
	const validationResults = [];

	// If we have validation errors, add them to the results
	if ((validationErrors) && (validationErrors.length > 0)) {
		validationResults.push((
			<div key={uuidv4()}>
				<h2>General Errors</h2>
				<List>
					{validationErrors}
				</List>
			</div>
		));
	}

	// If we have validation warings, add them to the results
	if ((validationWarnings) && (validationWarnings.length > 0)) {
		validationResults.push((
			<div key={uuidv4()}>
				<h2>General Warnings</h2>
				<List>
					{validationWarnings}
				</List>
			</div>
		));
	}

	return validationResults;
};

class NodeListPage extends React.Component {
	render() {
		// Validate the project nodes
		const projectValidationResults = yarnService
			.validateProjectNodes(this.props.projectFilePath, this.props.project.nodes);

		// Get the project node links
		const projectNodeLinks = yarnService
			.getProjectNodeLinks(this.props.projectFilePath, this.props.project.nodes);

		// Render the general validation results
		const generalValidationResults = renderGeneralValidationResults(projectValidationResults);

		// The list fields
		const fields = [
			{
				name: 'section',
				displayName: 'Section',
				getContentCallback: fieldListItemContent.getTextFromItemField,
			},
			{
				name: 'title',
				displayName: 'Title',
				getContentCallback: fieldListItemContent.getTextFromItemField,
			},
			{
				name: 'tags',
				displayName: 'Tags',
				getContentCallback: fieldListItemContent.getTextFromItemField,
			},
			{
				name: 'incomingLinks',
				displayName: 'Incoming Links',
				getContentCallback: (item, field, onAddItemClick, onEditItemClick) =>
					getIncomingLinkButtons(
						projectNodeLinks,
						this.props.classes,
						item,
						field,
						onAddItemClick,
						onEditItemClick,
					),
			},
			{
				name: 'outgoingLinks',
				displayName: 'Outgoing Links',
				getContentCallback: (item, field, onAddItemClick, onEditItemClick) =>
					getOutgoingLinkButtons(
						projectNodeLinks,
						this.props.classes,
						item,
						field,
						onAddItemClick,
						onEditItemClick,
					),
			},
			{
				name: 'validationResults',
				displayName: 'Validation',
				getContentCallback: (item, field, onAddItemClick, onEditItemClick) =>
					getValidationResultIcon(
						projectValidationResults,
						this.props.classes,
						item,
						field,
						onAddItemClick,
						onEditItemClick,
					),
			},
		];

		const addEditForm = props => (
			<NodeEditorForm
				{...props}
				projectNodeLinks={projectNodeLinks}
				projectFilePath={this.props.projectFilePath}
			/>);

		return (
			<div>
				<ListPage
					onProjectChanged={this.props.onProjectChanged}
					project={this.props.project}
					projectPropName="nodes"
					fields={fields}
					keyName="title"
					addEditForm={addEditForm}
					addEditFormEditTitle="Add Node"
					addEditFormAddTitle="Edit Node"
					addEditFormSchema={[
						{
							fieldName: 'title',
							label: 'Title',
							readOnly: false,
							multiline: false,
						},
						{
							fieldName: 'tags',
							label: 'Tags',
							readOnly: false,
							multiline: false,
						},
						{
							fieldName: 'section',
							label: 'Section',
							readOnly: false,
							multiline: false,
						},
						{
							fieldName: 'colorId',
							label: 'Color ID',
							readOnly: false,
							multiline: false,
						},
						{
							fieldName: 'position',
							label: 'Position',
							readOnly: false,
							multiline: false,
						},
						{
							fieldName: 'body',
							label: 'Body',
							readOnly: false,
							multiline: false,
						},
					]}
				/>
				{generalValidationResults}
			</div>
		);
	}
}

NodeListPage.propTypes = {
	onProjectChanged: PropTypes.func.isRequired,

	project: PropTypes.object,
	projectFilePath: PropTypes.string.isRequired,
};

NodeListPage.defaultProps = {
	project: null,
};

export default withStyles(styles, { withTheme: true })(NodeListPage);
