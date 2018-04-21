// React Imports
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

// Electron Imports
import { ipcRenderer } from 'electron';

// General Component Imports
import Page from './ui/general/pages/Page';
// Page Imports
import CharacterPage from './ui/domain/pages/CharacterPage';
import DefaultPage from './ui/domain/pages/DefaultPage';
import FunctionPage from './ui/domain/pages/FunctionPage';
import NodePage from './ui/domain/pages/NodePage';
import VariablePage from './ui/domain/pages/VariablePage';
import MainMenu from './ui/domain/components/MainMenu';

import currentProjectService from './services/currentProjectService';

const theme = createMuiTheme();

class App extends Component {
	constructor(props) {
		super(props);

		// Set up the initial state
		this.state = {
			// We don't have a current project initially
			hasCurrentProject: false,
			currentProject: null,
		};
	}

	componentWillMount() {
		// Get the current project (if any)
		const currentProject = currentProjectService.get();

		// Record the current project (if any) in our state
		this.setState({
			hasCurrentProject: !!currentProject,
			currentProject,
		});
	}

	onSaveProject = () => {
		console.log('Saving Project');
	};

	onSaveProjectAs = () => {
		console.log('Saving Project As...');

		// Get the current project
		const currentProject = currentProjectService.get();

		// Convert it to JSON
		const currentProjectJSON = JSON.stringify(currentProject);

		// Save the current project under another name
		ipcRenderer.send('saveAsClick', currentProjectJSON);
	};

	onCreateNewProject = () => {
		// Create a new project
		const newProject = {
			name: 'New Project',
			nodes: [],
			characters: [],
			functions: [],
			variables: [],
		};

		// Store the new project
		currentProjectService.set(newProject);

		// Record the new project in our state
		this.setState({
			hasCurrentProject: true,
			currentProject: newProject,
		});
	}

	onExportYarnFile = () => {
		console.log('Exporting Yarn File');
	};

	onImportYarnFile = () => {
		console.log('Importing Yarn File');
	};

	onRunProject = () => {
		console.log('Running Project');
	};

	onCloseProject = () => {
		// Remove the project from storage
		currentProjectService.clear();

		// Clear the project from our state
		this.setState(
			{
				hasCurrentProject: false,
				currentProject: null,
			},
			// Navigate back to the home page
			() => this.navigateToHome(),
		);
	};

	onOpenExistingProject = () => {
		// Set up a handler for when the project is loaded
		// The loaded project will be passed as a JSON string in the "arg"
		// parameter
		ipcRenderer.on('content-loaded', (event, arg) => {
			// Convert the JSON string to an object
			const currentProject = JSON.parse(arg);

			// Store the loaded project
			currentProjectService.set(currentProject);

			// Record the loaded project in our state
			this.setState({
				hasCurrentProject: true,
				currentProject,
			});
		});

		// Open a project
		ipcRenderer.send('openClick');
	};

	onCurrentProjectChanged = (updatedCurrentProject) => {
		// Store the updated project
		currentProjectService.set(updatedCurrentProject);

		// Record the updated project in our state
		this.setState({
			hasCurrentProject: true,
			currentProject: updatedCurrentProject,
		});
	}

	navigateToHome = () => {
		this.props.history.push('/');
	};

	render() {
		// Build the app components
		const Menu = () =>	(<MainMenu
			hasCurrentProject={this.state.hasCurrentProject}
			onCreateNewProject={this.onCreateNewProject}
			onSaveProject={this.onSaveProject}
			onSaveProjectAs={this.onSaveProjectAs}
			onOpenExistingProject={this.onOpenExistingProject}
			onRunProject={this.onRunProject}
			onImportYarnFile={this.onImportYarnFile}
			onExportYarnFile={this.onExportYarnFile}
			onCloseProject={this.onCloseProject}
		/>);

		const BasePage = props => (
			<Page mainMenu={Menu} title={props.title}>
				{props.children}
			</Page>
		);

		const HomePageComplete = () => (
			<BasePage title="Home">
				<DefaultPage />
			</BasePage>
		);

		const CharacterPageComplete = () => (
			<BasePage title="Characters">
				<CharacterPage
					currentProject={this.state.currentProject}
					onCurrentProjectChanged={this.onCurrentProjectChanged}
				/>
			</BasePage>
		);

		const FunctionPageComplete = () => (
			<BasePage title="Functions">
				<FunctionPage
					currentProject={this.state.currentProject}
					onCurrentProjectChanged={this.onCurrentProjectChanged}
				/>
			</BasePage>
		);

		const NodePageComplete = () => (
			<BasePage title="Nodes">
				<NodePage
					currentProject={this.state.currentProject}
					onCurrentProjectChanged={this.onCurrentProjectChanged}
				/>
			</BasePage>
		);

		const VariablePageComplete = () => (
			<BasePage title="Variables">
				<VariablePage
					currentProject={this.state.currentProject}
					onCurrentProjectChanged={this.onCurrentProjectChanged}
				/>
			</BasePage>
		);

		return (
			<div>
				<Route exact path="/" component={HomePageComplete} />
				<Route path="/characters" component={CharacterPageComplete} />
				<Route path="/functions" component={FunctionPageComplete} />
				<Route path="/nodes" component={NodePageComplete} />
				<Route path="/variables" component={VariablePageComplete} />
			</div>
		);
	}
}

const AppContainer = () => {
	// Wrap the app so it has access to the routers match, location, and history props
	const AppWithRouter = withRouter(App);

	return (
		<MuiThemeProvider theme={theme}>
			<Router>
				<AppWithRouter />
			</Router>
		</MuiThemeProvider>
	);
};

export default AppContainer;
