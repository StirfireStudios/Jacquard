import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import themes from '../../domain/themes';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';

import * as MenuActions from '../../../actions/ui/menu';

const styles = theme => ({
  ...themes.defaultTheme(theme),
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
});

function toggleMenu() {
  MenuActions.Toggle();
}

function PageTitle(props) {

  const { title, classes } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            aria-label="Menu"
            color="inherit"
            className={classes.menuButton}
            children={<MenuIcon/>}
            onClick={toggleMenu}
          />
          <Typography className={classes.title} variant="title" color="inherit" noWrap>
            {title}
          </Typography>
          <div key="grow" className={classes.grow} />
          {props.children}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles)(PageTitle);
