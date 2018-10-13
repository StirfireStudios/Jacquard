import React from 'react';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';

import themes from '../themes';

import TitleBar from '../../general/components/TitleBar';

import * as Actions from '../../../actions/project/misc';

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
  const options = this.props.project.settings != null ? this.props.project.settings : {}
  const newOptions = Object.assign({}, options);
  this.setState({options: newOptions});
}

function saveOptions() {
  Actions.ChangeSettings(this.state.options);
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
    if (props.project == null || props.project.settings == null) {
      this.state = { options: {} };  
    } else {
      this.state = { options: props.project.settings };
    }
  }

  render() {
    const modified = isModified(this.state.options, this.props.settings);
  
    return (
      <Paper className={this.props.classes.pageRoot}>
        <TitleBar title="Project Options"/>
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

function mapStateToProps(state) {
	const ProjectData = state.Project;
	return {
		busy: ProjectData.busy,
	  settings: ProjectData.settings,
	}
}

export default withStyles(themes.defaultTheme)(connect(mapStateToProps)(OptionsPage));
