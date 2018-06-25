import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import themes from '../themes';

import * as ActionAsync from '../../../actionsAsync/export/export';

const electron = window.require('electron');

function saveBytecode(project, options) {
  electron.remote.dialog.showOpenDialog({
    title: "Save Bytecode to",
    properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
  }, (filePaths) => {
    if (filePaths == null) return;
    if (filePaths.length === 0) return;
    ActionAsync.Bytecode(filePaths[0], project, options);
  });
}

function changeOptionFunc(stateName, field, event, checkbox) {
  const newStatePart = {};
  newStatePart[stateName] = Object.assign({}, this.state[stateName]);
  if (checkbox) {
    newStatePart[stateName][field] = event.target.checked;
  } else {
    newStatePart[stateName][field] = event.target.value;
  }
  this.setState(newStatePart);
}

function renderOption(stateName, field, text) {
  const state = this.state[stateName];
  const value = state != null && state[field] != null ? state[field] : false;
  return (
    <FormControlLabel 
      key={field}
      control={
        <Switch
          label={text}
          checked={value}
          onChange={changeOptionFunc.bind(this, stateName, field, true)}
        />
      } 
      label={text}
    />
  );
}

function renderBytecode() {
  const saveFunc = saveBytecode.bind(this, this.props.project, this.state.bytecode);
  return (
    <Paper className="bytecode">
      <Typography variant="caption">Bytecode</Typography>
      <div key="options">
        {renderOption.call(this, "bytecode", "sourceMap", "Output SourceMap")}
        {renderOption.call(this, "bytecode", "debug", "Output Debug info")}
      </div>
      <div key="file">
        <TextField
          id="prefix"
          label="File Prefix"
          value={this.state.bytecode.prefix}
          onChange={changeOptionFunc.bind(this, "bytecode", "prefix")}
          className="input"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
				/>
        <Button variant="raised" children="Save" onClick={saveFunc}/>
      </div>
    </Paper>
  );
}

class ExportPage extends React.Component {
  constructor(props) {
    super();
    this.state = { bytecode: {sourceMap: false, debug: false, prefix: ""} };  
  }

  render() {
    if (this.props.project == null) return <div>No project loaded</div>;
      
    return (
      <div>
        {renderBytecode.call(this)}
      </div>
    );    
  }
}

export default withStyles(themes.defaultTheme)(ExportPage);
