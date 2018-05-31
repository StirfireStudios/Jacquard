import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const ModalDialog = props => (
	<Dialog
		open={props.open}
		onClose={props.onCancel}
		aria-labelledby="form-dialog-title"
	>
		<Grid container spacing={0} justify="center">
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
