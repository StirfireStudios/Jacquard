import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

const ModalDialog = props => (
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
		<DialogActions className={props.classes.root}>
			<Grid item xs={12}>
				<Grid container spacing={10} justify="center" alignItems="center">
					<Grid item xs={3}>
						<Button
							onClick={props.onOK}
							variant="raised"
							color="primary"
							fullHeight
						>
							{props.okButtonLabel}
						</Button>
					</Grid>
					<Grid item xs={3}>
						<Button
							onClick={props.onCancel}
							variant="raised"
							color="secondary"
							fullHeight
						>
							{props.cancelButtonLabel}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</DialogActions>
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

export default withStyles(styles, { withTheme: true })(ModalDialog);
