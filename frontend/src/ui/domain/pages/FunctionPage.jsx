import React from 'react';
import { withStyles } from 'material-ui/styles';
import ListPage from '../../general/pages/ListPage';
import themes from '../themes';

class FunctionPage extends React.Component {
	render() {
		const fieldNames = ['name', 'description'];
		const displayNames = ['Name', 'Description'];

		return (
			<ListPage
				fieldNames={fieldNames}
				displayNames={displayNames}
				keyName="name"
				currentProjectPropName="functions"
				editFormTitle="Edit Function"
				addFormTitle="Add Function"
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

export default withStyles(themes.defaultTheme)(FunctionPage);
