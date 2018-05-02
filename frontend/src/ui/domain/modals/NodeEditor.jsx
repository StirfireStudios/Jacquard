import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
// import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import red from 'material-ui/colors/red';

import uuidv4 from 'uuid/v4';

// import InsertCharacterIntoNode from './InsertCharacterIntoNode';
// import InsertConditionalIntoNode from './InsertConditionalIntoNode';
// import InsertFunctionCallIntoNode from './InsertFunctionCallIntoNode';
// import InsertNodeIntoNode from './InsertNodeIntoNode';
// import InsertVariableIntoNode from './InsertVariableIntoNode';

import FullScreenDialog from '../../general/components/FullScreenDialog';

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

class NodeEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validationErrors: [],
			validationWarnings: [],
			outgoingLinks: {},
			incomingLinks: {},
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
		const validationResult = this.validateNode(nextProps.projectFilePath, nextProps.data);

		// Record the new validation errors and warnings, and the links
		this.setState({
			validationErrors: validationResult.errors,
			validationWarnings: validationResult.warnings,
		});
	}

	onValidate = () => {
		// Validate the node
		const validationResult = this.validateNode(this.props.projectFilePath, this.props.data);

		// Record the new validation errors and warnings and links
		this.setState({
			validationErrors: validationResult.errors,
			validationWarnings: validationResult.warnings,
		});
	}

	validateNode = (projectFilePath, node) => {
		// Validate the project node
		const validationResult = yarnService.validateProjectNode(projectFilePath, node);

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
		const nodeLinks = this.props.projectNodeLinks[this.props.data.title];

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
				? () => this.props.onEditItemClick(node.name)
				: () => this.props.onAddItemClick(incomingLinkKey);

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
		const nodeLinks = this.props.projectNodeLinks[this.props.data.title];

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
				? () => this.props.onEditItemClick(node.name)
				: () => this.props.onAddItemClick(outgoingLinkKey);

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

	render() {
		// Get the classes prop
		const { classes } = this.props;

		// Do we have any data?
		if (this.props.data) {
			// Render the incoming and outgoing links
			const incomingLinks = this.renderIncomingLinks();
			const outgoingLinks = this.renderOutgoingLinks();

			// Render the validation results
			const validationResults = this.renderValidationResults();

			return (
				<FullScreenDialog
					open={this.props.open}
					onCancel={this.props.onCancel}
					onOK={this.props.onOK}
					title={this.props.title}
					description="Allows you to edit the node"
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
								{ /* <Button>Test From Here</Button> */ }
								{incomingLinks}
								<TextField
									id="node-title"
									label="Title"
									className={classes.textArea}
									value={this.props.data.title}
									onChange={(e) => { this.props.onUpdateFormField(e, 'title'); }}
								/>
								<TextField
									id="node-tags"
									label="Tags"
									className={classes.textArea}
									value={this.props.data.tags}
									onChange={(e) => { this.props.onUpdateFormField(e, 'tags'); }}
								/>
								<TextField
									className={classes.textArea}
									label="Section"
									value={this.props.data.section}
									onChange={(e) => { this.props.onUpdateFormField(e, 'section'); }}
								/>
								<TextField
									className={classes.textArea}
									label="Color ID"
									value={this.props.data.colorId}
									onChange={(e) => { this.props.onUpdateFormField(e, 'colorId'); }}
								/>
								<TextField
									className={classes.textArea}
									label="Position"
									value={this.props.data.position}
									onChange={(e) => { this.props.onUpdateFormField(e, 'position'); }}
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
									value={this.props.data.body}
									onChange={(e) => { this.props.onUpdateFormField(e, 'body'); }}
								/>
								{outgoingLinks}
								<Button
									variant="raised"
									onClick={this.onValidate}
								>
									Validate
								</Button>
								{validationResults}
							</div>
							<div
								className={classes.drawerPaper}
							>
								<TagList tags={this.props.data.tags} />
							</div>
						</div>

					</main>
				</FullScreenDialog>
			);
		}
		return (<div />);
	}
}

NodeEditor.propTypes = {
	title: PropTypes.string.isRequired,
	projectFilePath: PropTypes.string.isRequired,
	projectNodeLinks: PropTypes.object,
	data: PropTypes.object,
	open: PropTypes.bool.isRequired,
	onUpdateFormField: PropTypes.func.isRequired,
	onOK: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

NodeEditor.defaultProps = {
	projectNodeLinks: null,
	data: {},
};

export default withStyles(styles, { withTheme: true })(NodeEditor);
