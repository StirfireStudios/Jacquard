import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import uuidv4 from 'uuid/v4';

import ListPage from '../../general/pages/ListPage';
import fieldListItemContent from '../../general/utils/field-list-item-content';

import NodeEditor from '../modals/NodeEditor';

class NodeListPage extends React.Component {
	render() {
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
		];

		const addEditForm = props => (<NodeEditor {...props} />);

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

export default withStyles(themes.defaultTheme)(NodeListPage);
