import React from 'react';
import Icon from '@material-ui/core//Icon';
import ListButton from './ListButton';

class ListEditButton extends React.Component {
	render() {
		return (
			<ListButton color="primary" aria-label="edit" itemKey={this.props.itemKey} onClick={this.props.onClick}>
				<Icon>edit_icon</Icon>
			</ListButton>
		);
	}
}

export default ListEditButton;
