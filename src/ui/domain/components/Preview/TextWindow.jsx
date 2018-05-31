import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

import FuncReturnDialog from './FuncReturnDialog';

const styles = theme => ({
  monospace: {
    "font-family": "monospace"
  },
  nodeEntry: {
    border: "1px solid green",
    padding: "2px",
    margin: "5px",
  },
  optionText: {
    border: "1px dashed grey",
    padding: "2px",
    margin: "5px",     
  },
  argument: {
    border: "2px solid blue",
    padding: "2px",
    margin: "5px",    
  },
  button: {
    margin: theme.spacing.unit,
  },
})

function renderText(classes, index, string) {
  return <div key={index} className="text">{string}</div>;
}

function renderCommand(classes, index, args) {
  const renderedArgs = [];
  for(let index = 0; index < args.length; index++) {
    renderedArgs.push(
      <span key={index} className={classes.monospace}>{args[index]}</span>
    );
  }

  return <div key={index} className={classes.argument}>Command{renderedArgs}</div>;
}

function renderNodeEntry(classes, index, nodeName) {
  return <div key={index} className={classes.nodeEntry}>Entering <span className={classes.monospace}>{nodeName}</span></div>;
}

function renderSelectedOption(classes, index, selectedOption) {
  const text = [];
  for(let index = 0; index < selectedOption.text.length; index++) {
    const textLine = selectedOption.text[index];
    if (textLine.text == null) continue;
    text.push(<span key={index} className={classes.monospace}>{textLine.text}</span>);
  }

  return <div key={index} className={classes.optionText}>Player Selected - {text}</div>;
}

function renderVariableChange(classes, index, variableData) {
  let type = typeof(variableData.value);
  if (variableData.type === "save") {
    return <div key={index} className="variableSave">{variableData.name} is now {variableData.value} ({type})</div>;
  } else {
    return <div key={index} className="variableLoad">Loaded {variableData.value} ({type}) from {variableData.name}</div>;
  }
}

function renderTextArray() {
  const renderedText = [];
  for(let index = 0; index < this.props.text.length; index++) {
    const text = this.props.text[index];
    if (text.text != null) {
      renderedText.push(renderText(this.props.classes, index, text.text));
    } else if (text.command != null) {
      renderedText.push(renderCommand(this.props.classes, index, text.command));
    } else if (text.nodeEntered != null) {
      renderedText.push(renderNodeEntry(this.props.classes, index, text.nodeEntered));
    } else if (text.optionSelected != null) {
      renderedText.push(renderSelectedOption(this.props.classes, index, text.optionSelected));
    } else if (text.variable != null) {
      renderedText.push(renderVariableChange(this.props.classes, index, text.variable));
    }
  }
  return renderedText;
}

function renderOptions() {
  if (this.props.options == null) return null;

  const optionSelect = this.props.optionSelect;
  const classes = this.props.classes;

  return this.props.options.map((option, index) => {
    const action = optionSelect.bind(null, option);
    return(
      <Button 
        className={classes.button} 
        key={index} 
        onClick={action} 
        variant='outlined'
      >
        {option.text[0].text}
      </Button>
    )
  });
}

function renderFunc() {
  if (this.props.func == null) return null;
  return (
    <FuncReturnDialog func={this.props.func} returnValueAction={this.props.funcValue} />
  );
}

function renderHalted() {
  if (this.props.halted) return (<div>Halted</div>);
  if (this.props.endOfFile) return (<div>End Of File</div>);
  return null;
}

function scrollToBottom() {
  if (this.messagesEnd == null) return;
  this.messagesEnd.scrollIntoView({ behavior: "smooth" });
}

class TextWindow extends React.Component {
  componentDidMount() {
    scrollToBottom.call(this);
  }
  
  componentDidUpdate() {
    scrollToBottom.call(this);
  }

  render() {
    if (this.props.text.length === 0) return null;
    return (
      <div key={this.props.key} className={this.props.className}>
        {renderTextArray.call(this)}
        {renderOptions.call(this)}
        {renderFunc.call(this)}
        {renderHalted.call(this)}
        <div ref={(el) => { this.messagesEnd = el; }}></div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TextWindow);
