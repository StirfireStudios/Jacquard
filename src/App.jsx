import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import { withStyles } from '@material-ui/core/styles';

import themes from './ui/domain/themes';

import MainMenu from './ui/domain/components/MainMenu';

const style = {
	width: '100vw',
	height: '100vh',
};

function App(props) {

  const { classes } = props;

  return (    
    <div>
      <ReduxProvider store={props.store}>
        <ConnectedRouter history={props.history}>
          <div className={classes.appFrame} style={style}>
            <MainMenu/>
          </div>
        </ConnectedRouter>
      </ReduxProvider>
    </div>    
  )
}

export default withStyles(themes.defaultTheme)(App);
