import React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import MainMenu from '../../domain/components/MainMenu';

import themes from '../../domain/themes';

class Page extends React.Component {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.appFrame}>
				<AppBar className={classNames(classes.appBar)}>
					<Toolbar>
						<Typography variant="title" color="inherit" noWrap>
							{this.props.title}
						</Typography>
					</Toolbar>
				</AppBar>
				<MainMenu />
				<main className={classes.content}>
					{ this.props.children }
				</main>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(Page);
