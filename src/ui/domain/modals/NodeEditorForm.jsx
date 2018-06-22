import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';

import uuidv4 from 'uuid/v4';

// import InsertCharacterIntoNode from './InsertCharacterIntoNode';
// import InsertConditionalIntoNode from './InsertConditionalIntoNode';
// import InsertFunctionCallIntoNode from './InsertFunctionCallIntoNode';
// import InsertNodeIntoNode from './InsertNodeIntoNode';
// import InsertVariableIntoNode from './InsertVariableIntoNode';

import FullScreenDialog from '../../general/components/FullScreenDialog';
import ModalDialog from '../../general/components/ModalDialog';

import yarnService from '../../../services/yarnService';

/*
** Returns the caret (cursor) position of the specified text field.
** Return value range is 0-oField.value.length.
** See: https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
*/
/*
const getTextFieldCaretPosition = (textFieldElement) => {
	// The caret position
	let caretPosition = 0;

	// IE Support
	if (document.selection) {
		// Set focus on the element
		textFieldElement.focus();

		// To get cursor position, get empty selection range
		const selectionRange = document.selection.createRange();

		// Move selection start to 0 position
		selectionRange.moveStart('character', -textFieldElement.value.length);

		// The caret position is selection length
		caretPosition = selectionRange.text.length;
	} else if ((typeof textFieldElement.selectionStart === 'number') && (typeof textFieldElement.selectionEnd === 'number')) {
		// Firefox support
		caretPosition = textFieldElement.selectionDirection === 'backward' ?
			textFieldElement.selectionStart :
			textFieldElement.selectionEnd;
	}

	// Return results
	return caretPosition;
};
*/

const TagList = props => (<List
	component="nav"
	subheader={<ListSubheader component="div">Tags</ListSubheader>}
>
	{props.tags.split(',').map(t => (<ListItem key={t} button>{t}</ListItem>))}
</List>);

const styles = theme => ({
	drawerPaper: {
		flexGrow: 1,
	},
	toolbar: theme.mixins.toolbar,
	content: {
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing.unit * 3,
		flexGrow: 2,
	},
	textArea: {
		padding: theme.spacing.unit * 3,
	},
	parentContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	main: {
		height: '100%',
	},
	dataChanged: {
		backgroundColor: orange[500],
	},
	nodeLinks: {
		marginTop: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2,
	},
	nodeLinkText: {
		marginRight: theme.spacing.unit * 2,
	},
	nodeExistingLinkButton: {
		marginRight: theme.spacing.unit * 2,
	},
	nodeNonExistingLinkButton: {
		marginRight: theme.spacing.unit * 2,
		backgroundColor: red[500],
	},
});

//FixMe: this is a temporary validation function and should be made better.
function validateNodeData() {
	return this.state.data.title !== null;
}

function onInvalidNodeClick() {
	this.setState({
		data: null
	});
}

function renderInvalidNodeData() {
	return (
		<ModalDialog
			onOK={onInvalidNodeClick.bind(this)}
			onCancel={onInvalidNodeClick.bind(this)}
			title={`No node data!`}
			open={this.state.data != null}
			okButtonLabel="Cancel"
			cancelButtonLabel="Cancel"
		>
			<div>Check that the node name {this.props.dataKeyValue} is completely correct by going to that node and editing it.</div>
		</ModalDialog>
	);
}

class NodeEditorForm extends React.Component {
	constructor(props) {
		super(props);

		// Validate the node (if it's not being added)
		const validationResult = (!props.addModeEnabled)
			? this.validateNode(props.projectFilePath, props.data, props.projectOptions)
			: {
				errors: [],
				warnings: [],
			};

		// Set up the state
		this.state = {
			// Store the form data
			data: this.props.data,
			// Whether the data has changed (by default it hasn't)
			hasDataChanged: false,
			// Whether the cancel confirmation dialog is open (by default it isn't)
			cancelConfirmationDialogIsOpen: false,
			// The name of the node being added or editing
			addEditNodeName: '',
			// Whether the and and edit node confirmation dialogs are open (by default it isn't)
			addNodeConfirmationDialogIsOpen: false,
			editNodeConfirmationDialogIsOpen: false,
			// Store the validation errors and warnings
			validationErrors: validationResult.errors,
			validationWarnings: validationResult.warnings,
			/*
			insertCharacterIntoNodeModalOpen: false,
			insertConditionalIntoNodeModalOpen: false,
			insertFunctionCallIntoNodeModalOpen: false,
			insertNodeIntoNodeModalOpen: false,
			insertVariableIntoNodeModalOpen: false,
			*/
		};
	}

	/*
	onInsertCharacterIntoNodeModalOpen = () => {
		this.setState({ insertCharacterIntoNodeModalOpen: true });
	}

	onInsertCharacterIntoNodeModalOK = () => {
		this.setState({ insertCharacterIntoNodeModalOpen: false });
	}

	onInsertCharacterIntoNodeModalCancel = () => {
		this.setState({ insertCharacterIntoNodeModalOpen: false });
	}

	onInsertConditionalIntoNodeModalOpen = () => {
		this.setState({ insertConditionalIntoNodeModalOpen: true });
	}

	onInsertConditionalIntoNodeModalOK = () => {
		this.setState({ insertConditionalIntoNodeModalOpen: false });
	}

	onInsertConditionalIntoNodeModalCancel = () => {
		this.setState({ insertConditionalIntoNodeModalOpen: false });
	}

	onInsertFunctionCallIntoNodeModalOpen = () => {
		this.setState({ insertFunctionCallIntoNodeModalOpen: true });
	}

	onInsertFunctionCallIntoNodeModalOK = () => {
		this.setState({ insertFunctionCallIntoNodeModalOpen: false });
	}

	onInsertFunctionCallIntoNodeModalCancel = () => {
		this.setState({ insertFunctionCallIntoNodeModalOpen: false });
	}

	onInsertNodeIntoNodeModalOpen = () => {
		this.setState({ insertNodeIntoNodeModalOpen: true });
	}

	onInsertNodeIntoNodeModalOK = () => {
		this.setState({ insertNodeIntoNodeModalOpen: false });
	}

	onInsertNodeIntoNodeModalCancel = () => {
		this.setState({ insertNodeIntoNodeModalOpen: false });
	}

	onInsertVariableIntoNodeModalOpen = () => {
		this.setState({ insertVariableIntoNodeModalOpen: true });
	}

	onInsertVariableIntoNodeModalOK = () => {
		this.setState({ insertVariableIntoNodeModalOpen: false });
	}

	onInsertVariableIntoNodeModalCancel = () => {
		this.setState({ insertVariableIntoNodeModalOpen: false });
	}
	*/

	componentWillReceiveProps(nextProps) {
		// Validate the node
		const validationResult = this.validateNode(nextProps.projectFilePath, nextProps.data, nextProps.projectOptions);

		// Record the new validation errors and warnings, and the links
		this.setState({
			// Store the form data
			data: nextProps.data,
			// Whether the data has changed (by default it hasn't)
			hasDataChanged: false,
			// Store the validation errors and warnings
			validationErrors: validationResult.errors,
			validationWarnings: validationResult.warnings,
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

	onValidate = () => {
		// Validate the node
		const validationResult = this.validateNode(this.props.projectFilePath, this.state.data);

		// Record the new validation errors and warnings and links
		this.setState({
			validationErrors: validationResult.errors,
			validationWarnings: validationResult.warnings,
		});
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

	onAddNode = (nodeName) => {
		// Has the data changed?
		if (this.state.hasDataChanged) {
			// Ask the user if they're sure they want to edit the node
			this.setState({
				addEditNodeName: nodeName,
				addNodeConfirmationDialogIsOpen: true,
			});
		} else {
			// Just add the node
			this.props.onAddItemClick(nodeName);
		}
	}

	onAddNodeConfirmationDialogOK = () => {
		// Close the edit node confirmation dialog and add the node
		this.setState(
			{ addNodeConfirmationDialogIsOpen: false },
			() => this.props.onAddItemClick(this.state.addEditNodeName),
		);
	}

	onAddNodeConfirmationDialogCancel = () => {
		// Close the add node confirmation dialog
		this.setState({ addNodeConfirmationDialogIsOpen: false });
	}

	onEditNode = (nodeName) => {
		// Has the data changed?
		if (this.state.hasDataChanged) {
			// Ask the user if they're sure they want to edit the node
			this.setState({
				addEditNodeName: nodeName,
				editNodeConfirmationDialogIsOpen: true,
			});
		} else {
			// Just edit the node
			this.props.onEditItemClick(nodeName);
		}
	}

	onEditNodeConfirmationDialogOK = () => {
		// Close the edit node confirmation dialog and edit the node
		this.setState(
			{ editNodeConfirmationDialogIsOpen: false },
			() => this.props.onEditItemClick(this.state.addEditNodeName),
		);
	}

	onEditNodeConfirmationDialogCancel = () => {
		// Close the edit node confirmation dialog
		this.setState({ editNodeConfirmationDialogIsOpen: false });
	}

	validateNode = (projectFilePath, node, options) => {
		// Validate the project node
		const validationResult = yarnService.validateProjectNode(projectFilePath, node, options);

		// Get the validation errors
		const errors = (validationResult)
			? validationResult.errors
			: [];

		// Get the validation warnings
		const warnings = (validationResult)
			? validationResult.warnings
			: [];

		// Return the new validation errors and warnings
		return {
			errors,
			warnings,
		};
	}

	renderIncomingLinks = () => {
		// If the project doesn't have any node links, return an empty array
		if (!this.props.projectNodeLinks) {
			return [];
		}

		// Get the node links
		const nodeLinks = this.props.projectNodeLinks[this.state.data.title];

		// If we don't have any node links, return an empty array
		if (!nodeLinks) {
			return [];
		}

		// Build a button for each incoming link
		const incomingLinks = Object.keys(nodeLinks.incomingLinks).map((incomingLinkKey) => {
			// Get the node
			const node = nodeLinks.incomingLinks[incomingLinkKey];

			// Figure out the button class
			const buttonClass = (node)
				? this.props.classes.nodeExistingLinkButton
				: this.props.classes.nodeNonExistingLinkButton;

			// Figure out the button on-click handler
			const buttonOnClick = (node)
				? () => this.onEditNode(node.name)
				: () => this.onAddNode(incomingLinkKey);

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

		return (incomingLinks.length > 0)
			?
			(
				<div className={this.props.classes.nodeLinks}>
					<span className={this.props.classes.nodeLinkText}>Incoming Links:</span>
					{incomingLinks}
				</div>
			)
			:
			(
				<div className={this.props.classes.nodeLinks}>No incoming links</div>
			);
	}

	renderOutgoingLinks = () => {
		// If the project doesn't have any node links, return an empty array
		if (!this.props.projectNodeLinks) {
			return [];
		}

		// Get the node links
		const nodeLinks = this.props.projectNodeLinks[this.state.data.title];

		// If we don't have any node links, return an empty array
		if (!nodeLinks) {
			return [];
		}

		// Build a button for each outgoing link
		const outgoingLinks = Object.keys(nodeLinks.outgoingLinks).map((outgoingLinkKey) => {
			// Get the node
			const node = nodeLinks.outgoingLinks[outgoingLinkKey];

			// Figure out the button class
			const buttonClass = (node)
				? this.props.classes.nodeExistingLinkButton
				: this.props.classes.nodeNonExistingLinkButton;

			// Figure out the button on-click handler
			const buttonOnClick = (node)
				? () => this.onEditNode(node.name)
				: () => this.onAddNode(outgoingLinkKey);

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

		return (outgoingLinks.length > 0)
			?
			(
				<div className={this.props.classes.nodeLinks}>
					<span className={this.props.classes.nodeLinkText}>Outgoing Links:</span>
					{outgoingLinks}
				</div>
			)
			:
			(
				<div className={this.props.classes.nodeLinks}>No outgoing links</div>
			);
	}

	renderErrors = () =>
		// Build the validation errors
		this.state.validationErrors.map((validationError) => {
			// Build the location
			const location = yarnService.buildLocationString(validationError.location);

			return (
				<ListItem key={uuidv4()}>
					<Icon color="error">error</Icon>
					<ListItemText primary={validationError.message} secondary={location} />
				</ListItem>
			);
		});

	renderWarnings = () =>
		// Build the validation warnings
		this.state.validationWarnings.map((validationWarning) => {
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

	renderValidationResults = () => {
		// Render the validation errors and warnings
		const validationErrors = this.renderErrors();
		const validationWarnings = this.renderWarnings();

		// If we have no validation error or warnings, the node is valid
		if (((!validationErrors) || (validationErrors.length === 0)) &&
			((!validationWarnings) || (validationWarnings.length === 0))) {
			return (
				<p>The node is valid.</p>
			);
		}

		// The validation results
		const validationResults = [];

		// If we have validation errors, add them to the results
		if (validationErrors) {
			validationResults.push((
				<List key={uuidv4()}>
					{validationErrors}
				</List>
			));
		}

		// If we have validation errors, add them to the results
		if (validationErrors) {
			validationResults.push((
				<List key={uuidv4()}>
					{validationWarnings}
				</List>
			));
		}

		return validationResults;
	}

	renderValidateButton = () => {
		// Has the data changed? If so, change the validation button to show
		// that this is the case
		const className = (this.state.hasDataChanged)
			? this.props.classes.dataChanged
			: '';

		return (
			<Button
				className={className}
				variant="raised"
				onClick={this.onValidate}
			>
				Validate
			</Button>
		);
	};

	render() {
		// Get the classes prop
		const { classes } = this.props;

		// Do we have any form data?
		if (this.state.data) {
			if (!validateNodeData.call(this)) {
				return renderInvalidNodeData.call(this);
			}

			// Render the incoming and outgoing links
			const incomingLinks = this.renderIncomingLinks();
			const outgoingLinks = this.renderOutgoingLinks();

			// Render the validation results
			const validationResults = this.renderValidationResults();

			// Render the validation button
			const validationButton = this.renderValidateButton();

			return (
				<FullScreenDialog
					onOK={() => this.props.onOK(this.props.dataKeyValue, this.state.data)}
					onCancel={this.onCancel}
					title={this.props.title}
					description="Allows you to edit the node"
					open={this.props.open}
				>
					{ /*
					<InsertCharacterIntoNode
						open={this.state.insertCharacterIntoNodeModalOpen}
						onOK={this.onInsertCharacterIntoNodeModalOK}
						onCancel={this.onInsertCharacterIntoNodeModalCancel}
					/>
					<InsertConditionalIntoNode
						open={this.state.insertConditionalIntoNodeModalOpen}
						onOK={this.onInsertConditionalIntoNodeModalOK}
						onCancel={this.onInsertConditionalIntoNodeModalCancel}
					/>
					<InsertFunctionCallIntoNode
						open={this.state.insertFunctionCallIntoNodeModalOpen}
						onOK={this.onInsertFunctionCallIntoNodeModalOK}
						onCancel={this.onInsertFunctionCallIntoNodeModalCancel}
					/>
					<InsertNodeIntoNode
						open={this.state.insertNodeIntoNodeModalOpen}
						onOK={this.onInsertNodeIntoNodeModalOK}
						onCancel={this.onInsertNodeIntoNodeModalCancel}
					/>
					<InsertVariableIntoNode
						open={this.state.insertVariableIntoNodeModalOpen}
						onOK={this.onInsertVariableIntoNodeModalOK}
						onCancel={this.onInsertVariableIntoNodeModalCancel}
					/>
					*/ }
					<main className={classes.main}>
						<div className={classes.parentContainer}>
							<div className={classes.content}>
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
								<ModalDialog
									onOK={this.onAddNodeConfirmationDialogOK}
									onCancel={this.onAddNodeConfirmationDialogCancel}
									title="Warning!"
									open={this.state.addNodeConfirmationDialogIsOpen}
									okButtonLabel="Yes"
									cancelButtonLabel="No"
								>
									Changes will be lost, are you sure you want to add a new node?
								</ModalDialog>
								<ModalDialog
									onOK={this.onEditNodeConfirmationDialogOK}
									onCancel={this.onEditNodeConfirmationDialogCancel}
									title="Warning!"
									open={this.state.editNodeConfirmationDialogIsOpen}
									okButtonLabel="Yes"
									cancelButtonLabel="No"
								>
									Changes will be lost, are you sure you want to edit another node?
								</ModalDialog>
								{ /* <Button>Test From Here</Button> */ }
								{incomingLinks}
								<TextField
									id="node-title"
									label="Title"
									className={classes.textArea}
									value={this.state.data.title}
									onChange={event => this.onUpdateFormField('title', event.target.value)}
								/>
								<TextField
									id="node-tags"
									label="Tags"
									className={classes.textArea}
									value={this.state.data.tags}
									onChange={event => this.onUpdateFormField('tags', event.target.value)}
								/>
								<TextField
									className={classes.textArea}
									label="Section"
									value={this.state.data.section}
									onChange={event => this.onUpdateFormField('section', event.target.value)}
								/>
								<TextField
									className={classes.textArea}
									label="Color ID"
									value={this.state.data.colorId}
									onChange={event => this.onUpdateFormField('colorId', event.target.value)}
								/>
								<TextField
									className={classes.textArea}
									label="Position"
									value={this.state.data.position}
									onChange={event => this.onUpdateFormField('position', event.target.value)}
								/>
								{ /*
								<Paper>
									<div>Insert at Cursor</div>
									<Button onClick={this.onInsertVariableIntoNodeModalOpen}>Variable...</Button>
									<Button onClick={this.onInsertFunctionCallIntoNodeModalOpen}>Function Call...</Button>
									<Button onClick={this.onInsertCharacterIntoNodeModalOpen}>Character...</Button>
									<Button onClick={this.onInsertNodeIntoNodeModalOpen}>Node...</Button>
									<Button onClick={this.onInsertConditionalIntoNodeModalOpen}>Conditional...</Button>
								</Paper>
								*/ }
								<TextField
									label="Node Body"
									multiline
									rows="20"
									margin="normal"
									style={{ width: '100%' }}
									value={this.state.data.body}
									onChange={event => this.onUpdateFormField('body', event.target.value)}
								/>
								{outgoingLinks}
								{validationButton}
								{validationResults}
							</div>
							<div
								className={classes.drawerPaper}
							>
								<TagList tags={this.state.data.tags} />
							</div>
						</div>

					</main>
				</FullScreenDialog>
			);
		}
		return (<div />);
	}
}

NodeEditorForm.propTypes = {
	onDataModified: PropTypes.func.isRequired,
	onOK: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,

	title: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	addModeEnabled: PropTypes.bool.isRequired,
	dataKeyValue: PropTypes.any,
	data: PropTypes.object,

	projectFilePath: PropTypes.string.isRequired,
	projectNodeLinks: PropTypes.object,
};

NodeEditorForm.defaultProps = {
	dataKeyValue: '',
	data: {},

	projectNodeLinks: null,
};

export default withStyles(styles, { withTheme: true })(NodeEditorForm);
