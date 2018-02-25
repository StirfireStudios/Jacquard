// React Imports
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

// General Component Imports
import Page from './ui/general/pages/Page';
// Page Imports
import Characters from './ui/domain/pages/Characters';
import Default from './ui/domain/pages/Default';
import Functions from './ui/domain/pages/Functions';
import Nodes from './ui/domain/pages/Nodes';
import Variables from './ui/domain/pages/Variables';

const theme = createMuiTheme();

class App extends Component {
	render() {
		const homePage = () => <Page title="Home"><Default /></Page>;
		const characterPage = () => <Page title="Characters"><Characters /></Page>;
		const functionPage = () => <Page title="Functions"><Functions /></Page>;
		const nodePage = () => <Page title="Nodes"><Nodes /></Page>;
		const variablePage = () => <Page title="Variables"><Variables /></Page>;

		return (
			<MuiThemeProvider theme={theme}>
				<Router>
					<div>
						<Route exact path="/" component={homePage} />
						<Route path="/characters" component={characterPage} />
						<Route path="/functions" component={functionPage} />
						<Route path="/nodes" component={nodePage} />
						<Route path="/variables" component={variablePage} />
					</div>
				</Router>
			</MuiThemeProvider>
		);
	}
}
/*

*/

export default App;
