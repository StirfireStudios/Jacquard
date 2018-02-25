import React from 'react';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import themes from '../../domain/themes';

class ModalDialog extends React.Component {
	constructor(props) {
		super(props);
		this.handleClose = props.close;
	}

	render() {
		return (
			<div>
				<Dialog
					open={this.props.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
					<DialogContent>
						<DialogContentText>
							To subscribe to this website, please enter your email address here. We will send
							updates occationally.
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Email Address"
							type="email"
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleClose} color="primary">
							Subscribe
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(ModalDialog);
