import React from 'react';
import PropTypes from 'prop-types';

import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

const ModalDialog = props => (
	<div>
		<Dialog
			open={props.open}
			onClose={props.onCancel}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">
				{ props.title }
			</DialogTitle>
			<DialogContent>
				{ props.children }
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onCancel} variant="raised" color="secondary">
					{props.cancelButtonLabel}
				</Button>
				<Button onClick={props.onSave} variant="raised" color="primary">
					{props.okButtonLabel}
				</Button>
			</DialogActions>
		</Dialog>
	</div>
);

ModalDialog.propTypes = {
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,

	title: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,

	okButtonLabel: PropTypes.string,
	cancelButtonLabel: PropTypes.string,
};

ModalDialog.defaultProps = {
	okButtonLabel: 'OK',
	cancelButtonLabel: 'Cancel',
};

export default ModalDialog;
