import React from 'react';

import { Link, withRouter } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
 
function genGoToPath(path, history, onClick) {
  return (event) => {
    history.push(path);
    if (onClick != null) onClick(event);
  }
}

function MenuButton(props) {
  let onClick = props.onClick;
  let disabled = props.disabled;

  if (props.path != null) {
    onClick = genGoToPath(props.path, props.history, props.onClick);    
    if (disabled === false || disabled == null) {
      disabled = props.location.pathname.startsWith(props.path);
    }
  }

  return (
    <MenuItem button onClick={onClick} disabled={disabled} classes={props.classes}>
      {props.text}
    </MenuItem>
  )
}

export default withRouter(MenuButton);
