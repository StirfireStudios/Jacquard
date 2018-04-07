// React Imports
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

// Electron Imports
// import { ipcRenderer } from 'electron';

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
		this.state = {
			hasCurrentProject: false,
		};

		this.onSaveProject = this.onSaveProject.bind(this);
		this.onSaveProjectAs = this.onSaveProjectAs.bind(this);
		this.onCreateNewProject = this.onCreateNewProject.bind(this);
		this.onOpenExistingProject = this.onOpenExistingProject.bind(this);
		this.onCloseProject = this.onCloseProject.bind(this);
	}

	onSaveProject() {
		console.log('Saving Project');
		// ipcRenderer.send('saveAsClick', currentProjectService.get());
	}

	onSaveProjectAs() {
		console.log('Saving Project As...');
	}

	onCreateNewProject() {
		currentProjectService.set({
			name: 'New Project',
			nodes: [],
			characters: [],
			functions: [],
			variables: [],
		});

		this.setState({ hasCurrentProject: true });
	}

	onCloseProject() {
		currentProjectService.clear();
		this.setState({ hasCurrentProject: false });
	}

	onOpenExistingProject() {
		/* ipcRenderer.on('content-loaded', (event, arg) => {
			currentProjectService.set(arg);
			this.setState({ hasCurrentProject: true });
		});

		ipcRenderer.send('openClick');*/
	}

	render() {
		const Menu = () =>	(<MainMenu
			hasCurrentProject={this.state.hasCurrentProject}
			onCreateNewProject={this.onCreateNewProject}
			onSaveProject={this.onSaveProject}
			onSaveProjectAs={this.onSaveProjectAs}
			onOpenExistingProject={this.onOpenExistingProject}
			onCloseProject={this.onCloseProject}
		/>);

		const BasePage = props => <Page mainMenu={Menu} title={props.title}>{props.children}</Page>;
		const HomePageComplete = () => <BasePage title="Home"><DefaultPage currentProject={this.state.currentProject} /></BasePage>;
		const CharacterPageComplete = () => <BasePage title="Characters"><CharacterPage currentProject={this.state.currentProject} /></BasePage>;
		const FunctionPageComplete = () => <BasePage title="Functions"><FunctionPage currentProject={this.state.currentProject} /></BasePage>;
		const NodePageComplete = () => <BasePage title="Nodes"><NodePage currentProject={this.state.currentProject} /></BasePage>;
		const VariablePageComplete = () => <BasePage title="Variables"><VariablePage currentProject={this.state.currentProject} /></BasePage>;

		return (
			<MuiThemeProvider theme={theme}>
				<Router>
					<div>
						<Route exact path="/" component={HomePageComplete} />
						<Route path="/characters" component={CharacterPageComplete} />
						<Route path="/functions" component={FunctionPageComplete} />
						<Route path="/nodes" component={NodePageComplete} />
						<Route path="/variables" component={VariablePageComplete} />
					</div>
				</Router>
			</MuiThemeProvider>
		);
	}
}

export default App;
