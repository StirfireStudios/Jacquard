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
		return (
			<MuiThemeProvider theme={theme}>
				<Router>
					<Page>
						<Route exact path="/" component={Default} />
						<Route path="/characters" component={Characters} />
						<Route path="/functions" component={Functions} />
						<Route path="/nodes" component={Nodes} />
						<Route path="/variables" component={Variables} />
					</Page>
				</Router>
			</MuiThemeProvider>
		);
	}
}

export default App;
