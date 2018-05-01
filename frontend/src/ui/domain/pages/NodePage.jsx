import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import red from 'material-ui/colors/red';

import uuidv4 from 'uuid/v4';

import ListPage from '../../general/pages/ListPage';
import fieldListItemContent from '../../general/utils/field-list-item-content';

import NodeEditor from '../modals/NodeEditor';

import yarnService from '../../../services/yarnService';

const styles = theme => ({
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

class NodeListPage extends React.Component {
	render() {
		// Get the project node links
		const projectNodeLinks = yarnService
			.getProjectNodeLinks(this.props.currentProjectFilePath, this.props.currentProject.nodes);

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
		];

		const addEditForm = props => (
			<NodeEditor
				{...props}
				projectNodeLinks={projectNodeLinks}
			/>);

		return (
			<ListPage
				onCurrentProjectChanged={this.props.onCurrentProjectChanged}
				fields={fields}
				keyName="title"
				currentProject={this.props.currentProject}
				currentProjectFilePath={this.props.currentProjectFilePath}
				currentProjectPropName="nodes"
				editFormTitle="Edit Node"
				addFormTitle="Add Node"
				addEditForm={addEditForm}
				formSchema={[
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
		);
	}
}

NodeListPage.propTypes = {
	onCurrentProjectChanged: PropTypes.func.isRequired,

	currentProject: PropTypes.object,
	currentProjectFilePath: PropTypes.string.isRequired,
};

NodeListPage.defaultProps = {
	currentProject: null,
};

export default withStyles(styles, { withTheme: true })(NodeListPage);
