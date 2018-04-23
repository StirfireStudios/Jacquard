import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
// import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';

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
});

const buildLocationString = location => `${location.fileID}
 (${location.start.line}, ${location.start.column}) -
 (${location.end.line}, ${location.end.column})`;

class NodeEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validationErrors: [],
			validationWarnings: [],
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

	onValidate = () => {
		// Validate the project node
		const validationResult = yarnService.validateProjectNode(this.props.projectFilePath, this.props.data);

		// Get the validation errors
		const validationErrors = (validationResult)
			? validationResult.errors
			: [];

		// Get the validation warnings
		const validationWarnings = (validationResult)
			? validationResult.warnings
			: [];

		// Record the new validation errors and warnings
		this.setState({
			validationErrors,
			validationWarnings,
		});
	}

	renderErrors = () => {
		// Build the validation errors
		const validationErrors = this.state.validationErrors.map((validationError) => {
			// Build the location
			const location = buildLocationString(validationError.location);

			return (
				<ListItem key={uuidv4()}>
					<Icon color="error">error</Icon>
					<ListItemText primary={validationError.message} secondary={location} />
				</ListItem>
			);
		});

		return (
			<List>
				{validationErrors}
			</List>
		);
	}

	renderWarnings = () => {
		// Build the validation warnings
		const validationWarnings = this.state.validationWarnings.map((validationWarning) => {
			// Build the location
			const location = buildLocationString(validationWarning.location);

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

		return (
			<List>
				{validationWarnings}
			</List>
		);
	}

	render() {
		// Get the classes prop
		const { classes } = this.props;

		// Do we have any data?
		if (this.props.data) {
			// Render the validation errors and warnings
			const validationErrors = this.renderErrors();
			const validationWarnings = this.renderWarnings();

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
								<Button
									variant="raised"
									onClick={this.onValidate}
								>
									Validate
								</Button>
								{validationErrors}
								{validationWarnings}
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

NodeEditor.defaultProps = {
	data: {},
};

NodeEditor.propTypes = {
	title: PropTypes.string.isRequired,
	projectFilePath: PropTypes.string.isRequired,
	data: PropTypes.object,
	open: PropTypes.bool.isRequired,
	onUpdateFormField: PropTypes.func.isRequired,
	onOK: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default withStyles(styles)(NodeEditor);
