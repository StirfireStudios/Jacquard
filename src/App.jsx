import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import themes from './ui/domain/themes';

import MainMenu from './ui/domain/components/MainMenu';

import Nodes from './ui/domain/pages/Nodes';
import Options from './ui/domain/pages/Options';
import Welcome from './ui/domain/pages/Welcome';

const style = {
	width: '100vw',
	height: '100vh',
};

function routes() {
  const routes = [];
  routes.push(<Route key="nodes" path="/nodes" component={Nodes}/>);
  routes.push(<Route key="options" path="/options" component={Options}/>);
  routes.push(<Route key="welcome" path="/" component={Welcome}/>);
  return (
    <Switch>
      {routes}
    </Switch>
  )
}

function App(props) {

  const { classes } = props;

  return (    
    <div>
      <CssBaseline/>
      <ReduxProvider store={props.store}>
        <ConnectedRouter history={props.history}>
          <div className={classes.appFrame} style={style}>
            <MainMenu/>
            {routes()}
          </div>
        </ConnectedRouter>
      </ReduxProvider>
    </div>    
  )
}

export default withStyles(themes.defaultTheme)(App);
