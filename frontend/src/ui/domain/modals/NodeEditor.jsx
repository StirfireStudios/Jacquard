import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import List, { ListItem, ListSubheader } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import themes from '../themes';
import InsertCharacterIntoNode from './InsertCharacterIntoNode';
import InsertConditionalIntoNode from './InsertConditionalIntoNode';
import InsertFunctionCallIntoNode from './InsertFunctionCallIntoNode';
import InsertNodeIntoNode from './InsertNodeIntoNode';
import InsertVariableIntoNode from './InsertVariableIntoNode';

import FullScreenDialog from '../../general/components/FullScreenDialog';

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

		this.handleInsertCharacterIntoNodeModalOpen = this.handleInsertCharacterIntoNodeModalOpen.bind(this);
		this.handleInsertCharacterIntoNodeModalCancel = this.handleInsertCharacterIntoNodeModalCancel.bind(this);
		this.handleInsertConditionalIntoNodeModalOpen = this.handleInsertConditionalIntoNodeModalOpen.bind(this);
		this.handleInsertConditionalIntoNodeModalCancel = this.handleInsertConditionalIntoNodeModalCancel.bind(this);
		this.handleInsertFunctionCallIntoNodeModalOpen = this.handleInsertFunctionCallIntoNodeModalOpen.bind(this);
		this.handleInsertFunctionCallIntoNodeModalCancel = this.handleInsertFunctionCallIntoNodeModalCancel.bind(this);
		this.handleInsertNodeIntoNodeModalOpen = this.handleInsertNodeIntoNodeModalOpen.bind(this);
		this.handleInsertNodeIntoNodeModalCancel = this.handleInsertNodeIntoNodeModalCancel.bind(this);
		this.handleInsertVariableIntoNodeModalOpen = this.handleInsertVariableIntoNodeModalOpen.bind(this);
		this.handleInsertVariableIntoNodeModalCancel = this.handleInsertVariableIntoNodeModalCancel.bind(this);
	}

	handleInsertCharacterIntoNodeModalOpen() {
		this.setState({ insertCharacterIntoNodeModalOpen: true });
	}

	handleInsertCharacterIntoNodeModalCancel() {
		this.setState({ insertCharacterIntoNodeModalOpen: false });
	}

	handleInsertConditionalIntoNodeModalOpen() {
		this.setState({ insertConditionalIntoNodeModalOpen: true });
	}

	handleInsertConditionalIntoNodeModalCancel() {
		this.setState({ insertConditionalIntoNodeModalOpen: false });
	}

	handleInsertFunctionCallIntoNodeModalOpen() {
		this.setState({ insertFunctionCallIntoNodeModalOpen: true });
	}

	handleInsertFunctionCallIntoNodeModalCancel() {
		this.setState({ insertFunctionCallIntoNodeModalOpen: false });
	}

	handleInsertNodeIntoNodeModalOpen() {
		this.setState({ insertNodeIntoNodeModalOpen: true });
	}

	handleInsertNodeIntoNodeModalCancel() {
		this.setState({ insertNodeIntoNodeModalOpen: false });
	}

	handleInsertVariableIntoNodeModalOpen() {
		this.setState({ insertVariableIntoNodeModalOpen: true });
	}

	handleInsertVariableIntoNodeModalCancel() {
		this.setState({ insertVariableIntoNodeModalOpen: false });
	}

	render() {
		return (
			<FullScreenDialog
				open={this.props.open}
				handleCancel={this.props.handleCancel}
				title="Node Editor"
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
				<div>
					<div><Button>Test From Here</Button></div>
					<TextField
						id="node-title"
						label="Title"
						fullWidth
					/>
					<TextField
						id="node-tags"
						label="Tags"
						fullWidth
					/>
					<TextField
						id="node-content"
						label="Node Content"
						multiline
						rows="10"
						defaultValue="Default Value"
						margin="normal"
						style={{ width: '100%', height: '300px' }}
					/>
					<Paper>
						<div>Insert at Cursor</div>
						<Button onClick={this.handleInsertVariableIntoNodeModalOpen}>Variable...</Button>
						<Button onClick={this.handleInsertFunctionCallIntoNodeModalOpen}>Function Call...</Button>
						<Button onClick={this.handleInsertCharacterIntoNodeModalOpen}>Character...</Button>
						<Button onClick={this.handleInsertNodeIntoNodeModalOpen}>Node...</Button>
						<Button onClick={this.handleInsertConditionalIntoNodeModalOpen}>Conditional...</Button>
					</Paper>
				</div>
				<List
					component="nav"
					subheader={<ListSubheader component="div">Tags</ListSubheader>}
				>
					<ListItem button>Tag One</ListItem>
					<ListItem button>Tag One</ListItem>
					<ListItem button>Tag One</ListItem>
					<ListItem button>Tag One</ListItem>
					<ListItem button>Tag One</ListItem>
				</List>
			</FullScreenDialog>
		);
	}
}

export default withStyles(themes.defaultTheme)(NodeEditor);

