import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core//Divider';

import { withStyles } from '@material-ui/core/styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

import * as RuntimeActions from '../../../../actions/preview/runtime';
import * as SourceDataActions from '../../../../actions/preview/sourceData';
import * as ViewActions from '../../../../actions/preview/view';

const styles = theme => ({
  interface: {
    "z-index": 100,
  },
	menuButton: {
    position: 'absolute',
    right: 0,
    top: "64px",
  },
});

function onRun() {
  RuntimeActions.Run();
  this.setState({open: false});
}

function onReset() {
  RuntimeActions.Reset();
  this.setState({open: false});
}

function onToggle(state) {
  ViewActions.ToggleVisibility(state);
  this.setState({open: false});
}

function closeAndCallBind(func) {
  const bindFunc = () => {
    this.setState({open: false});
    func();
  }
  return bindFunc.bind(this);
}

function toggleDrawer(open) {
  this.setState({open: open});
};

function renderRunItem() {
  return (
    <MenuItem 
      button={true} disabled={this.props.disablePlayback} 
      onClick={onRun.bind(this)}
    >
      Run
    </MenuItem>
  );
}

function renderRestartItem() {
  const disabled = !this.props.ready || !this.props.started;
  return (
    <MenuItem 
      button={true} disabled={disabled} 
      onClick={onReset.bind(this)}
    >
      Reset
    </MenuItem>
  );
}

function renderQuickRun() {
  if (!this.props.ready || this.props.disablePlayback || this.props.started) return null;
  return (
    <Button 
      disabled={this.props.disablePlayback} onClick={onRun.bind(this)}
      variant='outlined'
    >
      Run
    </Button>
  );
}

function renderInfoItems() {
  if (!this.props.ready) return null;
  return (
    <div>
      <Divider/>
      <MenuItem button={true} onClick={onToggle.bind(this, 'State')}>State</MenuItem>
      <MenuItem button={true} onClick={onToggle.bind(this, 'Variables')}>Variables</MenuItem>
      <MenuItem button={true} onClick={onToggle.bind(this, 'Nodes')}>Nodes</MenuItem>
    </div>
  );
}

class Interface extends React.Component {
  state = {
    open: false,
  };

  render() {
    const classes = this.props.classes;
    if (!this.props.ready) return null;
    return (
      <div className={classes.interface}>
        <Button 
          className={classes.menuButton}  mini={true}
            onClick={toggleDrawer.bind(this, true)} variant='fab'
        >
          <ChevronLeft/>
        </Button>
        {renderQuickRun.call(this)}
        <Drawer anchor="right" open={this.state.open} onClose={toggleDrawer.bind(this, false)}>
          {renderRunItem.call(this)}
          {renderInfoItems.call(this)}
          <Divider/>
          {renderRestartItem.call(this)}
          <Button onClick={closeAndCallBind.call(this, SourceDataActions.Updated)}>Recompile</Button>
        </Drawer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const Runtime = state.Preview.State;
  const View = state.Preview.View;
  return {
    ready: Runtime.ready,
    started: Runtime.runMode != null,
    halted: Runtime.halted,
    disablePlayback: (Runtime.options !== null) || (Runtime.halted) || (Runtime.endOfFile),
    options: Runtime.options,
    characters: Runtime.characters,
    showCharacters: View.showCharacters,
    state: Runtime.variableState,
    showState: View.showState,
    variables: Runtime.variables,
    showVariables: View.showVariables,
    nodeNames: Runtime.nodeNames,
    showNodeNames: View.showNodeNames,
    nodeHistory: Runtime.nodeHistory,
    showNodeHistory: View.showNodeHistory,
  }
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Interface));
