import React from 'react';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
 
import themes from '../../domain/themes';

import * as Utils from '../../Utils';

function genGoToPath(path, history, onClick) {
  return (event) => {
    history.push(path);
    if (onClick != null) onClick(event);
  }
}

function MenuButton(props) {
  let onClick = props.onClick;
  let selected = props.selected;
  let disabled = props.disabled;
  let classes = { root: []};

  if (props.path != null) {
    onClick = genGoToPath(props.path, props.history, props.onClick);    
    if (selected == null) {
      selected = props.location.pathname.startsWith(props.path);
    }
    if (disabled === false || disabled == null) {
      disabled = selected;
    }
  }

  if (selected) classes.root.push(props.classes.selected);
  Utils.composeClasses(classes, props.appendClasses);

  return (
    <MenuItem button onClick={onClick} disabled={disabled} classes={classes}>
      {props.text}
    </MenuItem>
  )
}

export default withRouter(withStyles(themes.defaultTheme)(MenuButton));
