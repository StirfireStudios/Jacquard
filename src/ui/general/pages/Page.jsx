import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import themes from '../../domain/themes';

const style = {
	width: '100vw',
	height: '100vh',
};

class Page extends React.Component {
	render() {
		const MainMenu = this.props.mainMenu;
		const { classes } = this.props;
		return (
			<div className={classes.appFrame} style={style}>
				<AppBar className={classNames(classes.appBar)}>
					<Toolbar>
						<Typography variant="title" color="inherit" noWrap>
							{this.props.title}
						</Typography>
					</Toolbar>
				</AppBar>
				<MainMenu />
				<Paper
					className={classes.content}
					style={{
						overflow: 'auto',
						height: 'initial',
					}}
				>
					{this.props.children}
				</Paper>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(Page);
