import React from 'react';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import themes from '../../domain/themes';

class ModalForm extends React.Component {
	constructor(props) {
		super(props);
		this.close = props.close;
	}

	render() {
		return (
			<Modal
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				open={this.props.open}
				onClose={this.handleClose}
			>
				<div>
					<Typography variant="title" id="modal-title">
						{ this.props.title }
					</Typography>
					<Typography variant="subheading" id="modal-description">
						{ this.props.description }
					</Typography>
					{ this.props.children }

					<Button onClick={this.close}>Close</Button>
				</div>
			</Modal>
		);
	}
}

export default withStyles(themes.defaultTheme)(ModalForm);
