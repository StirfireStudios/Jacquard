import React from 'react';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { withStyles } from '@material-ui/core/styles';

const types = {
  'String': { valid: () => {return true;}, conv: (value) => {return value.toString();} },
  'Null': { valid: validNull, conv: () => {return null;} },
  'Integer': { valid: validInt, conv: (value) => { return parseInt(value, 10); } },
  'Float': { valid: validFloat, conv: (value) => { return parseFloat(value); } },
  'Boolean': { valid: validBool, conv: convBool },
}

function validNull(value) { 
  return value.length === 0;
}

function validInt(value) {
  return value === parseInt(value, 10).toString();
}

function validFloat(value) {
  return value === parseFloat(value).toString();
}

function validBool(value) {
  if (value.toLowerCase().startsWith('t')) return true;
  if (value.toLowerCase().startsWith('f')) return true;
  if (value.toLowerCase().startsWith('y')) return true;
  if (value.toLowerCase().startsWith('n')) return true;
  return false;
}

function convBool(value) {
  if (value.toLowerCase().startsWith('t')) return true;
  if (value.toLowerCase().startsWith('y')) return true;
  return false;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'relative',
  },
});

function onValueChange(event) {
  this.setState({value: event.target.value});
}

function onTypeChange(value) {
  this.setState({type: value.target.value});
}

function onSubmitValue(event) {
  const realValue = types[this.state.type].conv(this.state.value)
  this.props.returnValueAction(realValue);
  event.preventDefault();
}

function renderInput() {
  return (
    <div key="input">
      <Input 
        placeholder="Return Value" 
        onChange={onValueChange.bind(this)} 
        value={this.state.value}
      />
    </div>
  );
}

function renderSubmit() {
  const disabled = !types[this.state.type].valid(this.state.value);
  return (
    <div key="submit">
      <Button 
        disabled={disabled} 
        onClick={onSubmitValue.bind(this)}
        variant='raised'
      >
        Return
      </Button>
    </div>
  )
}

function renderType() {
  const buttons = Object.keys(types).map((typeName, index) => {
    const type = types[typeName];
    const disabled = !type.valid(this.state.value);
    return (
      <FormControlLabel value={typeName} control={<Radio disabled={disabled} />} label={typeName} />
    )
  });

  return (
    <RadioGroup value={this.state.type} onChange={onTypeChange.bind(this)} children={buttons}/>
  );
}

class FuncReturnDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      type: 'Null',
    }
  } 

  render() {
    const funcName = this.props.func.name;
    const funcArgs = this.props.func.args;

    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={0} justify="center">
          <Grid item xs={12}>Enter return value for function call "{funcName}"</Grid>
          <Grid item xs={6}>{renderInput.call(this)}{renderSubmit.call(this)}</Grid>
          <Grid item xs={6}>{renderType.call(this)}</Grid>
        </Grid>
      </div>
    )
  }  

}

export default withStyles(styles, { withTheme: true })(FuncReturnDialog);
