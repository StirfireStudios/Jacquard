import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const styles = {
	appBar: {
		position: 'relative',
	},
	flex: {
		flex: 1,
	},
};

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class FullScreenDialog extends React.Component {
	render() {
		const { classes } = this.props;
		return (
			<div>
				<Dialog
					fullScreen
					open={this.props.open}
					onClose={this.props.onClose}
					TransitionComponent={Transition}
				>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<IconButton color="inherit" onClick={this.props.onCancel} aria-label="Close">
								<CloseIcon />
							</IconButton>
							<Typography variant="title" color="inherit" className={classes.flex}>
								{this.props.title}
							</Typography>
							<Button color="inherit" onClick={this.props.onOK}>
								OK
							</Button>
						</Toolbar>
					</AppBar>
					<div style={{ flex: 1, width: '100%' }}>
						{ this.props.children }
					</div>
				</Dialog>
			</div>
		);
	}
}

FullScreenDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullScreenDialog);
