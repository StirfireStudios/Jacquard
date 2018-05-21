import { connect } from 'react-redux';
import React, { Component } from 'react';

import LoadFiles from './LoadFiles';
import Viewer from './Viewer';

function currentMode() {
  switch(this.props.mode) {
    case "loading": 
      return(<LoadFiles/>);
    case "running":
      return(<Viewer/>);
    default:
      return(<span>Unknown mode!</span>);
  }
}

class CurrentMode extends Component {
  render() {
    const mode = currentMode.call(this);

    return (
      <div>
        {mode}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let mode = "loading";
  if (state.Runtime.active) mode = "running";
  return {
    mode: mode
  }
}

export default connect(mapStateToProps)(CurrentMode);