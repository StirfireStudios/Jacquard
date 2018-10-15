import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

import packageFile from '../../../../package.json';

import themes from '../themes';

import TitleBar from '../../general/components/TitleBar';

function WelcomePage(props) {
  const { classes } = props;

  return (
    <Paper className={classes.pageRoot}>
      <TitleBar title={`Jacquard ${packageFile.version}`}/>
      <div className={classes.content}>
				Welcome to Jacquard!
      </div>
    </Paper>
  );
}

export default withStyles(themes.defaultTheme)(WelcomePage);