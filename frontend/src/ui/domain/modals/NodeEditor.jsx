import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
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
	{props.tag.split(',').map(t => (<ListItem key={t} button>{t}</ListItem>))}
</List>);

const styles = (theme) => {
	const widthAmount = 240 + (theme.spacing.unit * 6);
	return ({
		drawerPaper: {
			position: 'relative',
			width: 240,
			marginLeft: 240,
			float: 'right',
			flexGrow: 1,
		},
		toolbar: theme.mixins.toolbar,
		content: {
			backgroundColor: theme.palette.background.default,
			padding: theme.spacing.unit * 3,
			width: `calc(100% - ${widthAmount}px`,
			overflow: 'hidden',
			position: 'relative',
			display: 'block',
			clear: 'left',
		},
		textArea: {
			padding: theme.spacing.unit * 3,
			display: 'block',
		},
	});
};

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

	handleInsertCharacterIntoNodeModalOpen = () => {
		this.setState({ insertCharacterIntoNodeModalOpen: true });
	}

	handleInsertCharacterIntoNodeModalCancel = () => {
		this.setState({ insertCharacterIntoNodeModalOpen: false });
	}

	handleInsertConditionalIntoNodeModalOpen = () => {
		this.setState({ insertConditionalIntoNodeModalOpen: true });
	}

	handleInsertConditionalIntoNodeModalCancel = () => {
		this.setState({ insertConditionalIntoNodeModalOpen: false });
	}

	handleInsertFunctionCallIntoNodeModalOpen = () => {
		this.setState({ insertFunctionCallIntoNodeModalOpen: true });
	}

	handleInsertFunctionCallIntoNodeModalCancel = () => {
		this.setState({ insertFunctionCallIntoNodeModalOpen: false });
	}

	handleInsertNodeIntoNodeModalOpen = () => {
		this.setState({ insertNodeIntoNodeModalOpen: true });
	}

	handleInsertNodeIntoNodeModalCancel = () => {
		this.setState({ insertNodeIntoNodeModalOpen: false });
	}

	handleInsertVariableIntoNodeModalOpen = () => {
		this.setState({ insertVariableIntoNodeModalOpen: true });
	}

	handleInsertVariableIntoNodeModalCancel = () => {
		this.setState({ insertVariableIntoNodeModalOpen: false });
	}

	render() {
		const { classes } = this.props;

		if (this.props.data) {
			return (
				<FullScreenDialog
					open={this.props.open}
					onCancel={this.props.onCancel}
					onOk={this.props.onOk}
					title={this.props.title}
					description="Allows you to edit the node"
				>
					<InsertCharacterIntoNode
						open={this.state.insertCharacterIntoNodeModalOpen}
						handleCancel={this.handleInsertCharacterIntoNodeModalCancel}
					/>
					<InsertConditionalIntoNode
						open={this.state.insertConditionalIntoNodeModalOpen}
						handleCancel={this.handleInsertConditionalIntoNodeModalCancel}
					/>
					<InsertFunctionCallIntoNode
						open={this.state.insertFunctionCallIntoNodeModalOpen}
						handleCancel={this.handleInsertFunctionCallIntoNodeModalCancel}
					/>
					<InsertNodeIntoNode
						open={this.state.insertNodeIntoNodeModalOpen}
						handleCancel={this.handleInsertNodeIntoNodeModalCancel}
					/>
					<InsertVariableIntoNode
						open={this.state.insertVariableIntoNodeModalOpen}
						handleCancel={this.handleInsertVariableIntoNodeModalCancel}
					/>
					<Drawer
						variant="permanent"
						classes={{
							paper: classes.drawerPaper,
						}}
						anchor="right"
					>
						<TagList tag={this.props.data.tag} />
					</Drawer>
					<main className={classes.content}>
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
							value={this.props.data.tag}
							onChange={(e) => { this.props.onUpdateFormField(e, 'tag'); }}
						/>
						<TextField
							className={classes.textArea}
							label="Section"
							value={this.props.data.section}
							onChange={(e) => { this.props.onUpdateFormField(e, 'section'); }}
						/>
						<TextField
							label="Node Content"
							multiline
							rows="10"
							margin="normal"
							style={{ height: '300px' }}
							value={this.props.data.content}
							onChange={(e) => { this.props.onUpdateFormField(e, 'content'); }}
						/>
						<Paper>
							<div>Insert at Cursor</div>
							<Button onClick={this.handleInsertVariableIntoNodeModalOpen}>Variable...</Button>
							<Button onClick={this.handleInsertFunctionCallIntoNodeModalOpen}>Function Call...</Button>
							<Button onClick={this.handleInsertCharacterIntoNodeModalOpen}>Character...</Button>
							<Button onClick={this.handleInsertNodeIntoNodeModalOpen}>Node...</Button>
							<Button onClick={this.handleInsertConditionalIntoNodeModalOpen}>Conditional...</Button>
						</Paper>
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
	onOk: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default withStyles(styles)(NodeEditor);