import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core//Divider';
import { Link } from 'react-router-dom';
import ListItemText from '@material-ui/core/ListItemText';
import orange from '@material-ui/core//colors/orange';

import themes from '../themes';
import packageFile from '../../../../package.json';

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

const styles = theme => ({
	...themes.defaultTheme(theme),
	dataChanged: {
		backgroundColor: orange[500],
	},
});

class MainMenu extends React.Component {
	constructor(props) {
		super(props);
		this.ProjectMenu = this.ProjectMenu.bind(this);
	}

	ProjectMenu() {
		// Determine the Save Project class based on whether the project has been
		// modified
		const saveProjectClasses = (this.props.projectIsModified)
			?
			{
				root: this.props.classes.dataChanged,
			}
			:
			{
			};

		return (this.props.hasProject)
			? (
				<div>
					<Divider />
					<Link to="/visualization">
						<MenuItem button>
							<ListItemText primary="Visualization" />
						</MenuItem>
					</Link>
					<Divider />
					<Link to="/nodes">
						<MenuItem button>
							<ListItemText primary="Nodes" />
						</MenuItem>
					</Link>
{/*					<Link to="/characters"> */}
						<MenuItem button disabled={true}>
							<ListItemText primary="Characters" />
						</MenuItem>
{/*					</Link> */}
{/*					<Link to="/functions"> */}
						<MenuItem button disabled={true}>
							<ListItemText primary="Functions" />
						</MenuItem>
{/*					</Link> */}
{/*				<Link to="/variables"> */}
						<MenuItem button disabled={true}>
							<ListItemText primary="Variables" />
						</MenuItem>
{/*				</Link> */}
					<Link to="/options">
						<MenuItem button>
							<ListItemText primary="Project Options" />
						</MenuItem>
					</Link>
					<Divider />
					<MenuItem
						button
						classes={saveProjectClasses}
						onClick={this.props.onSaveProject}
					>
						<ListItemText primary="Save Project" />
					</MenuItem>
					<MenuItem button onClick={this.props.onSaveProjectAs}>
						<ListItemText primary="Save Project As..." />
					</MenuItem>
					<MenuItem button onClick={this.props.onExportYarnFile}>
						<ListItemText primary="Export Project To Yarn" />
					</MenuItem>
					<MenuItem button onClick={this.props.onCloseProject}>
						<ListItemText primary="Close Project" />
					</MenuItem>
				</div>
			)
			: null;
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
					<h2>Jacquard {packageFile.version}</h2>
				</div>
				<Divider />
				<Link to="/"><MenuItem button><ListItemText primary="Home" /></MenuItem></Link>
				<Divider />
				<Link to="/preview"><MenuItem button><ListItemText primary="Preview" /></MenuItem></Link>
				<this.ProjectMenu />
				<Divider />
				<MenuItem button onClick={this.props.onCreateNewProject}><ListItemText primary="Create New Project" /></MenuItem>
				<MenuItem button onClick={this.props.onOpenExistingProject}><ListItemText primary="Open Existing Project" /></MenuItem>
				<MenuItem button onClick={this.props.onImportYarnFile}><ListItemText primary="Import Project From Yarn" /></MenuItem>
			</Drawer>
		);
	}
}

export default withStyles(styles)(MainMenu);
