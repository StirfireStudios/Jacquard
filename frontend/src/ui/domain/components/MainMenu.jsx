import React from 'react';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import { MenuList, MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router-dom';
import { ListItemText } from 'material-ui/List';

import themes from '../themes';

/* TODO: Change the links to use embedded components like so:
class ListItemLink extends React.Component {
  renderLink = itemProps => <Link to={this.props.to} {...itemProps} />;

  render() {
    const { icon, primary, secondary, to } = this.props;
    return (
      <li>
        <ListItem button component={this.renderLink}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText inset primary={primary} secondary={secondary} />
        </ListItem>
      </li>
    );
  }
}
*/

class MainMenu extends React.Component {
	constructor(props) {
		super(props);
		this.CurrentProjectMenu = this.CurrentProjectMenu.bind(this);
	}

	CurrentProjectMenu() {
		let returnValue = null;

		if (this.props.hasCurrentProject) {
			returnValue = (<MenuList>
				<Link to="/nodes"><MenuItem button><ListItemText primary="Nodes" /></MenuItem></Link>
				<Link to="/characters"><MenuItem button><ListItemText primary="Characters" /></MenuItem></Link>
				<Link to="/functions"><MenuItem button><ListItemText primary="Functions" /></MenuItem></Link>
				<Link to="/variables"><MenuItem button><ListItemText primary="Variables" /></MenuItem></Link>
				<MenuItem button onClick={this.props.onExportYarnFile}><ListItemText primary="Export Yarn File" /></MenuItem>
				<MenuItem button onClick={this.props.onImportYarnFile}><ListItemText primary="Import Yarn File" /></MenuItem>
				<MenuItem button onClick={this.props.onRunProject}><ListItemText primary="Run Project" /></MenuItem>
				<MenuItem button onClick={this.props.onSaveProject}><ListItemText primary="Save Project" /></MenuItem>
				<MenuItem button onClick={this.props.onSaveProjectAs}><ListItemText primary="Save Project As..." /></MenuItem>
				<MenuItem button onClick={this.props.onCloseProject}><ListItemText primary="Close Project" /></MenuItem>
			</MenuList>);
		}
		return returnValue;
	}


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
					<h2>Jacquard v0.0.1</h2>
				</div>
				<Divider />
				<Link to="/"><MenuItem button><ListItemText primary="Home" /></MenuItem></Link>
				<this.CurrentProjectMenu />
				<Divider />
				<MenuList>
					<MenuItem button onClick={this.props.onCreateNewProject}><ListItemText primary="Create New Project" /></MenuItem>
					<MenuItem button onClick={this.props.onOpenExistingProject}><ListItemText primary="Open Existing Project" /></MenuItem>
				</MenuList>
			</Drawer>
		);
	}
}

const styleFunc = withStyles(themes.defaultTheme);


export default styleFunc(MainMenu);
