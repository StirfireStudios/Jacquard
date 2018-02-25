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
		this.handleInsertCharacterIntoNodeModalClose = this.handleInsertCharacterIntoNodeModalClose.bind(this);
		this.handleInsertConditionalIntoNodeModalOpen = this.handleInsertConditionalIntoNodeModalOpen.bind(this);
		this.handleInsertConditionalIntoNodeModalClose = this.handleInsertConditionalIntoNodeModalClose.bind(this);
		this.handleInsertFunctionCallIntoNodeModalOpen = this.handleInsertFunctionCallIntoNodeModalOpen.bind(this);
		this.handleInsertFunctionCallIntoNodeModalClose = this.handleInsertFunctionCallIntoNodeModalClose.bind(this);
		this.handleInsertNodeIntoNodeModalOpen = this.handleInsertNodeIntoNodeModalOpen.bind(this);
		this.handleInsertNodeIntoNodeModalClose = this.handleInsertNodeIntoNodeModalClose.bind(this);
		this.handleInsertVariableIntoNodeModalOpen = this.handleInsertVariableIntoNodeModalOpen.bind(this);
		this.handleInsertVariableIntoNodeModalClose = this.handleInsertVariableIntoNodeModalClose.bind(this);
	}

	handleInsertCharacterIntoNodeModalOpen() {
		this.setState({ insertCharacterIntoNodeModalOpen: true });
	}

	handleInsertCharacterIntoNodeModalClose() {
		this.setState({ insertCharacterIntoNodeModalOpen: false });
	}

	handleInsertConditionalIntoNodeModalOpen() {
		this.setState({ insertConditionalIntoNodeModalOpen: true });
	}

	handleInsertConditionalIntoNodeModalClose() {
		this.setState({ insertConditionalIntoNodeModalOpen: false });
	}

	handleInsertFunctionCallIntoNodeModalOpen() {
		this.setState({ insertFunctionCallIntoNodeModalOpen: true });
	}

	handleInsertFunctionCallIntoNodeModalClose() {
		this.setState({ insertFunctionCallIntoNodeModalOpen: false });
	}

	handleInsertNodeIntoNodeModalOpen() {
		this.setState({ insertNodeIntoNodeModalOpen: true });
	}

	handleInsertNodeIntoNodeModalClose() {
		this.setState({ insertNodeIntoNodeModalOpen: false });
	}

	handleInsertVariableIntoNodeModalOpen() {
		this.setState({ insertVariableIntoNodeModalOpen: true });
	}

	handleInsertVariableIntoNodeModalClose() {
		this.setState({ insertVariableIntoNodeModalOpen: false });
	}

	render() {
		return (
			<FullScreenDialog
				open={this.props.open}
				handleClose={this.props.handleClose}
				title="Node Editor"
				description="Allows you to edit the node"
			>
				<InsertCharacterIntoNode
					open={this.state.insertCharacterIntoNodeModalOpen}
					handleClose={this.handleInsertCharacterIntoNodeModalClose}
				/>
				<InsertConditionalIntoNode
					open={this.state.insertConditionalIntoNodeModalOpen}
					handleClose={this.handleInsertConditionalIntoNodeModalClose}
				/>
				<InsertFunctionCallIntoNode
					open={this.state.insertFunctionCallIntoNodeModalOpen}
					handleClose={this.handleInsertFunctionCallIntoNodeModalClose}
				/>
				<InsertNodeIntoNode
					open={this.state.insertNodeIntoNodeModalOpen}
					handleClose={this.handleInsertNodeIntoNodeModalClose}
				/>
				<InsertVariableIntoNode
					open={this.state.insertVariableIntoNodeModalOpen}
					handleClose={this.handleInsertVariableIntoNodeModalClose}
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

