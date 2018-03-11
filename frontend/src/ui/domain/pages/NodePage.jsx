import React from 'react';
import { withStyles } from 'material-ui/styles';
import ListPage from '../../general/pages/ListPage';
import themes from '../themes';
import NodeEditor from '../modals/NodeEditor';

class NodeListPage extends React.Component {
	render() {
		const fieldNames = ['section', 'title', 'tag'];
		const displayNames = ['Section', 'Title', 'Tags'];

		const addEditForm = props => (<NodeEditor {...props} />);

		return (
			<ListPage
				fieldNames={fieldNames}
				displayNames={displayNames}
				keyName="title"
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
						fieldName: 'tag',
						label: 'Tag',
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
						fieldName: 'content',
						label: 'Content',
						readOnly: false,
						multiline: false,
					},
				]}
			/>
		);
	}
}

export default withStyles(themes.defaultTheme)(NodeListPage);
