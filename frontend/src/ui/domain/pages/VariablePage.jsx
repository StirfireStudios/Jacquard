import React from 'react';
import PropTypes from 'prop-types';

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
				onCurrentProjectChanged={this.props.onCurrentProjectChanged}
				fieldNames={fieldNames}
				displayNames={displayNames}
				keyName="name"
				currentProject={this.props.currentProject}
				currentProjectFilePath={this.props.currentProjectFilePath}
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
						label: 'Description',
						readOnly: false,
						multiline: true,
					},
				]}
			/>
		);
	}
}

VariablePage.propTypes = {
	onCurrentProjectChanged: PropTypes.func.isRequired,

	currentProject: PropTypes.object,
	currentProjectFilePath: PropTypes.string.isRequired,
};

VariablePage.defaultProps = {
	currentProject: null,
};

export default withStyles(themes.defaultTheme)(VariablePage);
