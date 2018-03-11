import React from 'react';
import { withStyles } from 'material-ui/styles';
import ListPage from '../../general/pages/ListPage';
import themes from '../themes';
import FieldListForm from '../../general/components/FieldListForm';

class NodeListPage extends React.Component {
	render() {
		const fieldNames = ['section', 'title', 'tag'];
		const displayNames = ['Section', 'Title', 'Tags'];

		const addEditForm = props => (<FieldListForm {...props} />);

		return (
			<ListPage
				fieldNames={fieldNames}
				displayNames={displayNames}
				keyName="title"
				currentProjectPropName="nodes"
				editFormTitle="Edit Function"
				addFormTitle="Add Function"
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
				]}
			/>
		);
	}
}

export default withStyles(themes.defaultTheme)(NodeListPage);
