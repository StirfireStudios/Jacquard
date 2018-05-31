import React from 'react';

import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';

import ModalDialog from '../../../general/components/ModalDialog';

import * as RuntimeActions from '../../../../actions/preview/runtime';

const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'relative',
  },
  state: {
    "text-align": "center",
  },
  section: {
    "text-align": "center",
    'max-height': '100px',
    overflow: 'auto',
  },
  cellValue: {
    position: 'absolute',
    right: 0,
  }
});

function onNodeStartAt(name, confirmed) {
  if (confirmed == null) {
    this.setState({ nodeName: name, });
    return;
  }

  this.setState({ nodeName: null, });

  if (confirmed) {
    RuntimeActions.MoveToNode(name);
  }
}

function renderNodes() {
  if (!this.props.visible.nodes) return null;

  const items = this.props.nodes.map((nodeName) => {
    return (
      <ListItem
        key={nodeName}
        button={true}
        children={nodeName}
        onClick={onNodeStartAt.bind(this, nodeName, null)}
        />
    )
  });

  return (
    <Grid item xs>
      <div className={this.props.classes.section}>
        <div>Nodes</div>
        <List dense={true} children={items}/>
      </div>
    </Grid>
  );
}

function renderState() {
  if (!this.props.visible.state) return null;

  const history = [];
  for(let index = 0; index < this.props.state.history.length; index++) {
    const nodeName = this.props.state.history[index];
    history.push(
      <ListItem
      key={index}
      button={true}
      children={nodeName}
      />
    )
  }

  const variables = Object.keys(this.props.state.variables).map((varName) => {
    return renderVariable.call(this, varName);
  });


  return (
    <Grid item xs>
      <div className={this.props.classes.state}>
      <div>State</div>
        <Grid container spacing={0}>
          <Grid item xs>
            <div className={this.props.classes.section}>
              <div>History</div>
              <List dense={true} children={history}/>
            </div>
          </Grid>
          <Grid item xs>
            <div className={this.props.classes.section}>
              <div>Variables</div>
              <List dense={true} children={variables}/>
            </div>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}

function renderStartConfirmModal() {
  return (
    <ModalDialog
      onOK={onNodeStartAt.bind(this, this.state.nodeName, true)}
      onCancel={onNodeStartAt.bind(this, this.state.nodeName, false)}
      title={`Start at ${this.state.nodeName}`}
      open={this.state.nodeName != null}
      okButtonLabel="Yes"
      cancelButtonLabel="No"
    >
      Move to {this.state.nodeName}
    </ModalDialog>    
  )
}

function renderVariables() {
  if (!this.props.visible.variables) return null;

  const items = this.props.variables.map((name) => {
    return renderVariable.call(this, name);
  });
  return (
    <Grid item xs>
      <div className={this.props.classes.section}>
        <div>Variables</div>
        <List dense={true} children={items}/>
      </div>
    </Grid>
  );
}

function renderVariable(name) {
  let textValue = null;
  const value = this.props.state.variables[name];
  if (value === undefined) { textValue = 'Undefined'; } else
  if (value === null) { textValue = 'Null'; } else
  if (typeof(value) === 'string') { textValue = value; } else
  textValue = value.toString();
  return (
    <ListItem key={name}>
      <span key='name'>${name}</span>
      <span className={this.props.classes.cellValue} key='val'>{textValue}</span>    
    </ListItem>
  )
}

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nodeName: null };
  }

	render() {
    if (!this.props.ready) return null;
    if (!this.props.visible) return null;
    
    return (
      <div>
        {renderStartConfirmModal.call(this)}
        <div className={this.props.classes.root}>
          <Grid container spacing={0} alignItems='flex-end' justify='center'>
            {renderState.call(this)}
            {renderNodes.call(this)}
            {renderVariables.call(this)}
          </Grid>
        </div>
      </div>
		);
	}
}

function mapStateToProps(state) {
  const View = state.Preview.View;
  const State = state.Preview.State;
	return {
    ready: State.ready,
    nodes: State.nodeNames,
    variables: State.variables,
    visible: View.showState || View.showNodes || View.showVariables,
    state: {
      history: State.nodeHistory,
      variables: State.variableState,
    },
    visible: {
      state: View.showState,
      nodes: View.showNodes,
      variables: View.showVariables, 
    }
	}
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(InfoPanel));
