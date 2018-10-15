import React from 'react';

import { withRouter } from 'react-router-dom';

import MenuItem from '@material-ui/core/MenuItem';
 
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
  let classes = props.classes;

  if (props.path != null) {
    onClick = genGoToPath(props.path, props.history, props.onClick);    
    if (selected == null) {
      selected = props.location.pathname.startsWith(props.path);
    }
    if (disabled === false || disabled == null) {
      disabled = selected;
    }
  }

  return (
    <MenuItem button onClick={onClick} disabled={disabled} classes={classes} selected={selected}>
      {props.text}
    </MenuItem>
  )
}

export default withRouter(MenuButton);
