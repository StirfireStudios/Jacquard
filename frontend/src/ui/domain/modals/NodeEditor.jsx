import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import List, { ListItem, ListSubheader } from 'material-ui/List';
import InsertCharacterIntoNode from './InsertCharacterIntoNode';
import InsertConditionalIntoNode from './InsertConditionalIntoNode';
import InsertFunctionCallIntoNode from './InsertFunctionCallIntoNode';
import InsertNodeIntoNode from './InsertNodeIntoNode';
import InsertVariableIntoNode from './InsertVariableIntoNode';

import FullScreenDialog from '../../general/components/FullScreenDialog';

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

class NodeEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			insertCharacterIntoNodeModalOpen: false,
			insertConditionalIntoNodeModalOpen: false,
			insertFunctionCallIntoNodeModalOpen: false,
			insertNodeIntoNodeModalOpen: false,
			insertVariableIntoNodeModalOpen: false,
		};
	}

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

	render() {
		const { classes } = this.props;

		if (this.props.data) {
			return (
				<FullScreenDialog
					open={this.props.open}
					onCancel={this.props.onCancel}
					onOK={this.props.onOK}
					title={this.props.title}
					description="Allows you to edit the node"
				>
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
					<main className={classes.main}>
						<div className={classes.parentContainer}>
							<div className={classes.content}>
								<Button>Test From Here</Button>
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
								<Paper>
									<div>Insert at Cursor</div>
									<Button onClick={this.onInsertVariableIntoNodeModalOpen}>Variable...</Button>
									<Button onClick={this.onInsertFunctionCallIntoNodeModalOpen}>Function Call...</Button>
									<Button onClick={this.onInsertCharacterIntoNodeModalOpen}>Character...</Button>
									<Button onClick={this.onInsertNodeIntoNodeModalOpen}>Node...</Button>
									<Button onClick={this.onInsertConditionalIntoNodeModalOpen}>Conditional...</Button>
								</Paper>
								<TextField
									label="Node Body"
									multiline
									rows="20"
									margin="normal"
									style={{ width: '100%' }}
									value={this.props.data.body}
									onChange={(e) => { this.props.onUpdateFormField(e, 'body'); }}
								/>
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
	data: PropTypes.object,
	open: PropTypes.bool.isRequired,
	onUpdateFormField: PropTypes.func.isRequired,
	onOK: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default withStyles(styles)(NodeEditor);
