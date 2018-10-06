import React from 'react';

import { connect } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

import Divider from '@material-ui/core//Divider';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import orange from '@material-ui/core/colors/orange';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import themes from '../themes';
import packageFile from '../../../../package.json';

import * as ActionsAsync from '../../../actionsAsync/project/yarnimport';

const electron = window.require('electron');
const os = electron.remote.require("os");
const platform = os.platform();

const styles = theme => ({
	...themes.defaultTheme(theme),
	dataChanged: {
		backgroundColor: orange[500],
	},
});

function importYarn() {
	const extension = platform === 'darwin' ? ['txt'] : ['yarn.txt']
	electron.remote.dialog.showOpenDialog({
		title: "Import Yarn File",
		properties: ['openFile'],
		filters: [
			{name: 'Yarn Files', extensions: extension},
		],
	}, (filePaths) => {
		if (filePaths == null) return;
		if (filePaths.length === 0) return;
		ActionsAsync.Import(filePaths[0]);
	});
}

function urlPush(url, history) {
	return () => {
		history.push(url);
	}
}

function getSaveProjectClasses(modified, classes) {
	if (modified) return { root: classes.dataChanged }
	return {}
};

function renderProjectMenu() {
	const { hasProject, projectIsModified, classes, onSaveProject } = this.props;
	const { onSaveProjectAs, onExportYarnFile, onCloseProject } = this.props;

	if (!hasProject) return null;
	const saveProjectClasses = getSaveProjectClasses(this.props.dirty, classes);

	return (
			<div>
			<Divider />
			<List>
				<Link to="/visualization">
					<MenuItem button>
						<ListItemText primary="Visualization" />
					</MenuItem>
				</Link>
			</List>
			<Divider />
			<List>
				<Link to="/nodes">
					<MenuItem button>
						<ListItemText primary="Nodes" />
					</MenuItem>
				</Link>
				<MenuItem button disabled={true} onClick={urlPush("/characters", this.props.history)}>
					<ListItemText primary="Characters" />
				</MenuItem>
				<MenuItem button disabled={true} onClick={urlPush("/functions", this.props.history)}>
					<ListItemText primary="Functions" />
				</MenuItem>
				<MenuItem button disabled={true} onClick={urlPush("/variables", this.props.history)}>
					<ListItemText primary="Variables" />
				</MenuItem>
				<MenuItem button onClick={urlPush("/options", this.props.history)}>
					<ListItemText primary="Project Options" />
				</MenuItem>
			</List>
			<Divider />
			<List>
				<MenuItem
					button
					classes={saveProjectClasses}
					onClick={onSaveProject}
				>
					<ListItemText primary="Save Project" />
				</MenuItem>
				<MenuItem button onClick={onSaveProjectAs}>
					<ListItemText primary="Save Project As..." />
				</MenuItem>
				<MenuItem button onClick={onExportYarnFile}>
					<ListItemText primary="Export Project To Yarn" />
				</MenuItem>
				<MenuItem button onClick={urlPush("/export", this.props.history)}>
					<ListItemText primary="Export Project Bytecode" />
				</MenuItem>
				<MenuItem button onClick={onCloseProject}>
					<ListItemText primary="Close Project" />
				</MenuItem>
			</List>
		</div>
	);
}

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
				<div>
					<Typography variant="title" align="center">Jacquard {packageFile.version}</Typography>
				</div>
				<Divider />
				<Link to="/"><MenuItem button><ListItemText primary="Home" /></MenuItem></Link>
				<Divider />
				<Link to="/preview"><MenuItem button><ListItemText primary="Preview" /></MenuItem></Link>
				{renderProjectMenu.call(this)}
				<Divider />
				<List>
					<MenuItem button onClick={this.props.onCreateNewProject}>
						<ListItemText primary="Create New Project" />
					</MenuItem>
					<MenuItem button onClick={this.props.onOpenExistingProject}>
						<ListItemText primary="Open Existing Project" />
					</MenuItem>
					<MenuItem button onClick={importYarn}>
						<ListItemText primary="Import Project From Yarn" />
					</MenuItem>
				</List>
			</Drawer>
		);
	}
}

function mapStateToProps(state) {
	const ProjectData = state.Project;
	return {
		busy: ProjectData.busy,
		dirty: ProjectData.dirty,
	}
}

export default withRouter(withStyles(styles)(connect(mapStateToProps)(MainMenu)));
