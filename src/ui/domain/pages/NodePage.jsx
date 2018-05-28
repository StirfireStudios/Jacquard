import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import List, { ListItem, ListItemText } from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';

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
	searchBoxContainer: {
		position: 'absolute',
		zIndex: 10,
		width: theme.spacing.unit * 64,
		bottom: theme.spacing.unit * 3,
		right: theme.spacing.unit * 16,
		margin: 0,
		padding: theme.spacing.unit * 2,
		color: theme.palette.common.white,
		backgroundColor: theme.palette.common.white,
	},
	searchBoxForm: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
	},
	searchBoxText: {
		width: '50%',
		marginRight: theme.spacing.unit * 2,
	},
	searchBoxFlag: {
		width: '40%',
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
	constructor(props) {
		super(props);

		// Set up the state of the component
		this.state = {
			// The text we'll search nodes for
			searchText: '',
			// Where to search
			searchTitle: true,
			searchBody: true,
			searchTags: true,
		};
	}

	onSearchTextChange = (searchText) => {
		this.setState({ searchText });
	}

	onSearchTitleCheckboxChange = (checked) => {
		this.setState({ searchTitle: checked });
	}

	onSearchBodyCheckboxChange = (checked) => {
		this.setState({ searchBody: checked });
	}

	onSearchTagsCheckboxChange = (checked) => {
		this.setState({ searchTags: checked });
	}

	getProjectNodeHiddenStates = (projectNodes) => {
		// If there's no search text, no nodes are missing
		if (this.state.searchText === '') {
			return {};
		}

		// Get the lower case version of the search text
		const searchTextLowerCase = this.state.searchText.toLowerCase();

		// Get the search flags
		const { searchTitle, searchBody, searchTags } = this.state;

		// Build the hidden states of the nodes
		const projectNodeHiddenStates = projectNodes.reduce((hiddenStates, node) => {
			// Get the node text as lowercase
			const nodeTitleLowerCase = node.title.toLowerCase();
			const nodeBodyLowerCase = node.body.toLowerCase();
			const nodeTagsLowerCase = node.tags.toLowerCase();

			// The node is hidden if we can't find the search text in the nodes
			// title, body, or tags (each of these searches is optional)
			// NOTE: searching is case-insensitive
			const matchTitle = ((searchTitle) && (nodeTitleLowerCase.indexOf(searchTextLowerCase) >= 0));
			const matchBody = ((searchBody) && (nodeBodyLowerCase.indexOf(searchTextLowerCase) >= 0));
			const matchTags = ((searchTags) && (nodeTagsLowerCase.indexOf(searchTextLowerCase) >= 0));

			// Update the hidden state of the node
			hiddenStates[node.title] = (!matchTitle) && (!matchBody) && (!matchTags);

			return hiddenStates;
		}, {});

		return projectNodeHiddenStates;
	}

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

		// Build a object representing the hidden state of each node
		const projectNodeHiddenStates = this.getProjectNodeHiddenStates(this.props.project.nodes);

		return (
			<div>
				<ListPage
					onProjectUpdated={this.props.onProjectUpdated}
					onDataModified={this.props.onDataModified}
					project={this.props.project}
					projectPropName="nodes"
					projectPropNameHiddenStates={projectNodeHiddenStates}
					fields={fields}
					keyName="title"
					addEditForm={addEditForm}
					addEditFormAddTitle="Add Node"
					addEditFormEditTitle="Edit Node"
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
				<Paper className={this.props.classes.searchBoxContainer}>
					<FormControl
						component="fieldset"
						className={this.props.classes.searchBoxForm}
					>
						<FormGroup row>
							<TextField
								className={this.props.classes.searchBoxText}
								value={this.state.searchText}
								onChange={event => this.onSearchTextChange(event.target.value)}
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={this.state.searchTitle}
										onChange={(event, checked) => this.onSearchTitleCheckboxChange(checked)}
									/>
								}
								label="Title"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={this.state.searchBody}
										onChange={(event, checked) => this.onSearchBodyCheckboxChange(checked)}
									/>
								}
								label="Body"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={this.state.searchTags}
										onChange={(event, checked) => this.onSearchTagsCheckboxChange(checked)}
									/>
								}
								label="Tags"
							/>
						</FormGroup>
					</FormControl>
				</Paper>
			</div>
		);
	}
}

NodeListPage.propTypes = {
	onProjectUpdated: PropTypes.func.isRequired,
	onDataModified: PropTypes.func.isRequired,

	project: PropTypes.object,
	projectFilePath: PropTypes.string.isRequired,
};

NodeListPage.defaultProps = {
	project: null,
};

export default withStyles(styles, { withTheme: true })(NodeListPage);
