import React from 'react';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import themes from '../../domain/themes';

class ModalDialog extends React.Component {
	constructor(props) {
		super(props);
		this.handleClose = props.handleClose;
	}

	render() {
		return (
			<div>
				<Dialog
					open={this.props.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">
						{ this.props.title }
					</DialogTitle>
					<DialogContent>
						{ this.props.children }
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleClose} color="primary">
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(ModalDialog);
