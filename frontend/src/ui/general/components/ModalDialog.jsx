import React from 'react';
import PropTypes from 'prop-types';

import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';

const ModalDialog = props => (
	<Dialog
		open={props.open}
		onClose={props.onCancel}
		aria-labelledby="form-dialog-title"
	>
		<Grid container spacing={8} justify="center">
			<Grid item xs={12}>
				<DialogTitle id="form-dialog-title">
					{ props.title }
				</DialogTitle>
			</Grid>
			<Grid item xs={12}>
				<DialogContent>
					{ props.children }
				</DialogContent>
			</Grid>
			<DialogActions>
				<Grid item xs={6}>
					<Button
						onClick={props.onOK}
						variant="raised"
						color="primary"
						fullWidth
					>
						{props.okButtonLabel}
					</Button>
				</Grid>
				<Grid item xs={6}>
					<Button
						onClick={props.onCancel}
						variant="raised"
						color="secondary"
						fullWidth
					>
						{props.cancelButtonLabel}
					</Button>
				</Grid>
			</DialogActions>
		</Grid>
	</Dialog>
);

ModalDialog.propTypes = {
	onOK: PropTypes.func.isRequired,
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
