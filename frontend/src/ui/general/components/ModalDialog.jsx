import React from 'react';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

class ModalDialog extends React.Component {
	render() {
		return (
			<div>
				<Dialog
					open={this.props.open}
					onClose={this.props.onCancel}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">
						{ this.props.title }
					</DialogTitle>
					<DialogContent>
						{ this.props.children }
					</DialogContent>
					<DialogActions>
						<Button onClick={this.props.onCancel} variant="raised" color="secondary">
							Cancel
						</Button>
						<Button onClick={this.props.onOk} variant="raised" color="primary">
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default ModalDialog;
