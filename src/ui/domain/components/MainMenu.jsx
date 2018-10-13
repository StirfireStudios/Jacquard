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

import * as Actions from '../../../actions/project/misc';

import * as FileIOActionsAsync from '../../../actionsAsync/project/fileIO';
import * as ImportActionsAsync from '../../../actionsAsync/project/yarnimport';

import JQRDMenuItem from '../../general/components/MenuLink';

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
		ImportActionsAsync.Import(filePaths[0]);
	});
}

function onCreateNewProject(dirty) {
	//TODO: add "are you sure?"
	Actions.Reset();
}

function onSaveProjectAs(data) {
	const extension = ['jqrd'];
	electron.remote.dialog.showOpenDialog({
		title: "Save Project",
		properties: ['openDirectory'],
		filters: [
			{name: 'Jacquard Projects', extensions: extension},
		],
	}, (paths) => {
		if (paths == null) return;
		if (paths.length === 0) return;
		FileIOActionsAsync.Write(paths[0], data)
	});
}

function onLoadProject() {
	const extension = ['jqrd'];
	electron.remote.dialog.showOpenDialog({
		title: "Load Project",
		properties: ['openDirectory'],
		filters: [
			{name: 'Jacquard Projects', extensions: extension},
		],
	}, (paths) => {
		if (paths == null) return;
		if (paths.length === 0) return;
		FileIOActionsAsync.Read(paths[0]);
	});	
}

function getSaveProjectClasses(modified, classes) {
	if (modified) return { root: classes.dataChanged }
	return {}
};

function MainMenu(props) {
	const { 
		classes, charactersPresent, dirty, functionsPresent, variablesPresent, 
		path, pathSet, data, 
	} = props;
	
	const saveProjectClasses = getSaveProjectClasses(dirty, classes);

	return (
		<Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
			<div>
				<Typography variant="title" align="center">Jacquard {packageFile.version}</Typography>
			</div>
			<Divider />
			<List>
				<JQRDMenuItem text="Nodes" path="/nodes"/>
				<JQRDMenuItem text="Node Map" path="/nodeMap"/>
				<JQRDMenuItem text="Preview" path="/preview"/>
				<JQRDMenuItem text="Characters" path="/characters" disabled={!charactersPresent}/>
				<JQRDMenuItem text="Functions" path="/functions" disabled={!functionsPresent}/>
				<JQRDMenuItem text="Variables" path="/variables" disabled={!variablesPresent}/>
				<JQRDMenuItem text="Options" path="/options"/>
			</List>
			<Divider />
			<List>
				<JQRDMenuItem 
					classes={saveProjectClasses}
					disabled={!pathSet}
					text="Save"
					onClick={FileIOActionsAsync.Write.bind(null, path, data)}				
				/>
				<JQRDMenuItem 
					classes={saveProjectClasses}
					text="Save As..."
					onClick={onSaveProjectAs.bind(null, data)}				
				/>
				<JQRDMenuItem
					path="/export"
					text="Export Bytecode"
					onClick={onSaveProjectAs.bind(null, data)}				
				/>
			</List>
			<Divider />
			<List>
				<JQRDMenuItem text="Load Project" onClick={onLoadProject}/>
				<JQRDMenuItem text="Import Yarn" onClick={importYarn} />
				<JQRDMenuItem text="New Project" onClick={onCreateNewProject.bind(null, dirty)}/>
			</List>
		</Drawer>
	);
}

function mapStateToProps(state) {
	const ProjectData = state.Project;
	return {		
		busy: ProjectData.busy,
		dirty: ProjectData.dirty,
		pathSet: ProjectData.path != null,
		path: ProjectData.path,
		charactersPresent: ProjectData.characters.length > 0,
		data: ProjectData,
		functionsPresent: ProjectData.functions.length > 0,
		variablesPresent: ProjectData.variables.length > 0,
	}
}

export default withRouter(withStyles(styles)(connect(mapStateToProps)(MainMenu)));
