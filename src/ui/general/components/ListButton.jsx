import React from 'react';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core//styles';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit / 2,
	},
});

class ListButton extends React.Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.onClick(this.props.itemKey);
	}

	render() {
		const { classes } = this.props;
		return (
			<Button variant="fab" mini color={this.props.color} onClick={this.onClick} aria-label={this.props.arialabel} className={classes.button}>
				{this.props.children}
			</Button>
		);
	}
}

export default withStyles(styles)(ListButton);
