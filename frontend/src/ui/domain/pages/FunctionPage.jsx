import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import ListPage from '../../general/pages/ListPage';
import themes from '../themes';
import FieldListForm from '../../general/components/FieldListForm';

class FunctionPage extends React.Component {
	render() {
		const addEditForm = props => (<FieldListForm {...props} />);
		const fieldNames = ['name', 'description'];
		const displayNames = ['Name', 'Description'];

		return (
			<ListPage
				onCurrentProjectChanged={this.props.onCurrentProjectChanged}
				fieldNames={fieldNames}
				displayNames={displayNames}
				keyName="name"
				currentProject={this.props.currentProject}
				currentProjectPropName="functions"
				editFormTitle="Edit Function"
				addFormTitle="Add Function"
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

FunctionPage.propTypes = {
	onCurrentProjectChanged: PropTypes.func.isRequired,

	currentProject: PropTypes.object,
};

FunctionPage.defaultProps = {
	currentProject: null,
};

export default withStyles(themes.defaultTheme)(FunctionPage);
