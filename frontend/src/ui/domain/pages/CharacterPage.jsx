import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import themes from '../themes';

import ListPage from '../../general/pages/ListPage';
import FieldListForm from '../../general/components/FieldListForm';
import fieldListItemContent from '../../general/utils/field-list-item-content';

class CharacterPage extends React.Component {
	render() {
		// The list fields
		const fields = [
			{
				name: 'name',
				displayName: 'Name',
				getContentCallback: fieldListItemContent.getTextFromItemField,
			},
			{
				name: 'description',
				displayName: 'Description',
				getContentCallback: fieldListItemContent.getTextFromItemField,
			},
		];

		const addEditForm = props => (<FieldListForm {...props} />);

		return (
			<ListPage
				onCurrentProjectChanged={this.props.onCurrentProjectChanged}
				fields={fields}
				keyName="name"
				currentProject={this.props.currentProject}
				currentProjectFilePath={this.props.currentProjectFilePath}
				currentProjectPropName="characters"
				addEditFormEditTitle="Edit Character"
				addEditFormAddTitle="Add Character"
				addEditForm={addEditForm}
				addEditFormSchema={[
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

CharacterPage.propTypes = {
	onCurrentProjectChanged: PropTypes.func.isRequired,

	currentProject: PropTypes.object,
	currentProjectFilePath: PropTypes.string.isRequired,
};

CharacterPage.defaultProps = {
	currentProject: null,
};

export default withStyles(themes.defaultTheme)(CharacterPage);
