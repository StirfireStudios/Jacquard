import React from 'react';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import { MenuList, MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router-dom';
import { ListItemText } from 'material-ui/List';

import themes from '../themes';

class MainMenu extends React.Component {
	render() {
		const { classes } = this.props;
		return (
			<Drawer
				variant="permanent"
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
				Jacquard v0.0.1
				</div>
				<Divider />
				<MenuList>
					<Link to="/"><MenuItem button><ListItemText primary="Home" /></MenuItem></Link>
					<Link to="/nodes"><MenuItem button><ListItemText primary="Nodes" /></MenuItem></Link>
					<Link to="/characters"><MenuItem button><ListItemText primary="Characters" /></MenuItem></Link>
					<Link to="/functions"><MenuItem button><ListItemText primary="Functions" /></MenuItem></Link>
					<Link to="/variables"><MenuItem button><ListItemText primary="Variables" /></MenuItem></Link>
				</MenuList>
			</Drawer>
		);
	}
}

console.log(withStyles);

const styleFunc = withStyles(themes.defaultTheme);


export default styleFunc(MainMenu);
