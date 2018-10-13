import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import themes from '../../domain/themes';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function PageTitle(props) {

  const { title } = props;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit" noWrap>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(themes.defaultTheme)(PageTitle);
