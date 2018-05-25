import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';

import themes from '../../themes';

import * as RuntimeActions from '../../../../actions/preview/runtime';
import * as SourceDataActions from '../../../../actions/preview/sourceData';

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

function renderRun() {
  if (this.props.halted) {
  }
  return <Button onClick={closeAndCallBind.call(this, RuntimeActions.Run)}>Run</Button>;
}

class Interface extends React.Component {
  state = {
    open: false,
  };

  render() {
    if (!this.props.ready) return null;
    return (
      <div>
        <Button onClick={toggleDrawer.bind(this, true)}>Show Options</Button>
        <Drawer anchor="right" open={this.state.open} onClose={toggleDrawer.bind(this, false)}>
          {renderRun.call(this)}
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
    disablePlayback: (Runtime.options !== null) || (Runtime.halted),
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

export default connect(mapStateToProps)(withStyles(themes.defaultTheme)(Interface));
