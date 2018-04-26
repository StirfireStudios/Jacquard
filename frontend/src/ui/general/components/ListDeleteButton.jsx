import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import ListButton from './ListButton';

class ListDeleteButton extends React.Component {
	render() {
		return (
			<ListButton color="secondary" aria-label="edit" itemKey={this.props.itemKey} onClick={this.props.onClick}>
				<DeleteIcon />
			</ListButton>
		);
	}
}

export default ListDeleteButton;
