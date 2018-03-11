import React from 'react';
import { withStyles } from 'material-ui/styles';
import ListPage from '../../general/pages/ListPage';
import themes from '../themes';
import FieldListForm from '../../general/components/FieldListForm';

class VariablePage extends React.Component {
	render() {
		const fieldNames = ['name', 'description'];
		const displayNames = ['Name', 'Description'];
		const addEditForm = props => (<FieldListForm {...props} />);

		return (
			<ListPage
				fieldNames={fieldNames}
				displayNames={displayNames}
				keyName="name"
				currentProjectPropName="variables"
				editFormTitle="Edit Variables"
				addFormTitle="Add Variables"
				addEditForm={addEditForm}
				formSchema={[
					{
						fieldName: 'name',
						label: 'Name',
						readOnly: false,
						multiline: false,
					},
					{
						fieldName: 'description',
						label: 'description',
						readOnly: false,
						multiline: true,
					},
				]}
			/>
		);
	}
}

export default withStyles(themes.defaultTheme)(VariablePage);
