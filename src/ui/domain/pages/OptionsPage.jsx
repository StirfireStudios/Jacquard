import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';

import themes from '../themes';

const optionNames = [
  {name: "Dialog segments separated by blank space", field: "dialogSegmentsRequireBlank"},
  {name: "Character support", field: "characterSupport"},
]

function toggleOptionFunc(option, event) {
  const newOptions = Object.assign({}, this.state.options);
  newOptions[option.field] = event.target.checked;
  this.setState({options: newOptions});
}

function resetOptions() {
  const options = this.props.project.options != null ? this.props.project.options : {}
  const newOptions = Object.assign({}, options);
  this.setState({options: newOptions});
}

function saveOptions() {
  const options = this.props.project.options != null ? this.props.project.options : {}
  const projectUpdate = Object.assign({}, this.props.project);
  projectUpdate.options = Object.assign({}, options,  this.state.options);
  this.props.onProjectUpdated(projectUpdate);
}

function isModified(currentOptions, savedOptions) {
  if (savedOptions == null) savedOptions = {};
  return Object.keys(currentOptions).reduce((modified, field) => {
    if (modified === true) return modified;
    if (savedOptions[field] == null) {
      if (currentOptions[field] === true) return true; 
      return false;
    }
    return savedOptions[field] !== currentOptions[field];
  }, false);
}

function renderOption(option, currentOptionValue) {
  const value = currentOptionValue[option.field] != null ? currentOptionValue[option.field] : false;
  return (
    <FormControlLabel 
      key={option.field}
      control={
        <Switch
          label={option.name}
          checked={value}
          onChange={toggleOptionFunc.bind(this, option)}
        />
      } 
      label={option.name}
    />
  );
}

class OptionsPage extends React.Component {
  constructor(props) {
    super();
    if (props.project == null || props.project.options == null) {
      this.state = { options: {} };  
    } else {
      this.state = { options: props.project.options };
    }
  }

  render() {
    if (this.props.project == null) return <div>No project loaded</div>;
    
    const modified = isModified(this.state.options, this.props.project.options);
  
    return (
      <Paper>
        {optionNames.map(option => renderOption.call(this, option, this.state.options))}
        <Button 
          key="actionReset"
          disabled={!modified}
          variant="raised"
          children={"Reset"}
          onClick={resetOptions.bind(this)}
        />
        <Button 
          key="actionApply"
          disabled={!modified}
          variant="raised"
          children={"Save"}
          onClick={saveOptions.bind(this)}
        />
      </Paper>
    );    
  }
}

export default withStyles(themes.defaultTheme)(OptionsPage);
