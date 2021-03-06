import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CharacterChangeIcon from '@material-ui/icons/ChatBubbleOutline';
import ChoiceIcon from '@material-ui/icons/CallSplit';
import CommandIcon from '@material-ui/icons/Code';
import FunctionIcon from '@material-ui/icons/SettingsEthernet';
import HaltedIcon from '@material-ui/icons/Done';
import NodeChangeIcon from '@material-ui/icons/Timeline';
import VarSaveIcon from '@material-ui/icons/Save';
import VarLoadIcon from '@material-ui/icons/Unarchive';

import FuncReturnDialog from './FuncReturnDialog';
import timestamp from 'time-stamp';

const styles = theme => ({
  dialogueSegment: {
    "border": "1px dashed black",
    padding: "2px",
    margin: "5px",
  },
  icon: {
    "vertical-align": "middle",
    padding: "2px",
  },
  monospace: {
    "font-family": "monospace"
  },
  commandArgument: {
    padding: "2px",
  },
  button: {
    margin: theme.spacing.unit,
  },
})

function renderText(index, text) {
  return (<div key={index} className="text">{text.text}</div>);
}

function renderDialogSegment(classes, array, index, currentCharacter, message) {
  const parts = [];
  for(let index = 0; index < message.text.length; index++) {
    const subMessage = message.text[index];
    parts.push(renderMessage(classes, index, subMessage));
  }
  array.push(
    <div key={index} className={classes.dialogueSegment}>
      <span key="id" className={classes.monospace}>Segment: {message.dialogSegment}</span>
      {parts}
    </div>
  )
}

function renderCommand(classes, index, args) {
  const renderedArgs = [];
  for(let index = 0; index < args.length; index++) {
    renderedArgs.push(
      <span key={index} className={[classes.monospace, classes.commandArgument].join(' ')}>{args[index]}</span>
    );
  }

  return <div key={index}><CommandIcon className={classes.icon}/>{renderedArgs}</div>;
}

function renderNodeEntry(classes, index, nodeName) {
  return (
    <div key={index}>
      <NodeChangeIcon className={classes.icon}/>
      Entering&nbsp;
      <span className={classes.monospace}>{nodeName}</span>
    </div>
  );
}

function renderSelectedOption(classes, index, selectedOption) {
  const text = [];
  for(let index = 0; index < selectedOption.text.length; index++) {
    const textLine = selectedOption.text[index];
    if (textLine.text == null) continue;
    text.push(<span key={index} className={classes.monospace}>{textLine.text}</span>);
  }

  return (
    <div key={index}>
      <ChoiceIcon className={classes.icon}/>
      Player Selected - {text}
    </div>
  );
}

function renderVariableChange(classes, index, variableData) {
  let type = typeof(variableData.value);

  let value = variableData.value;

  if (type === 'boolean') value = value ? "true" : "false";

  if (variableData.type === "save") {
    return (
      <div key={index} className="variableSave">
        <VarSaveIcon className={classes.icon}/>
        <span className={classes.monospace}>{variableData.name}</span>&nbsp;
        now: {value} ({type})
      </div>
    );
  } else {
    return (
      <div key={index} className="variableLoad">
        <VarLoadIcon className={classes.icon}/>
        Loaded&nbsp;
        {value} ({type}) from&nbsp;
        <span className={classes.monospace}>{variableData.name}</span>
      </div>
    );
  }
}

function renderFunctionCall(classes, index, functionData) {
  const { name, args, returnValue, returnRequired } = functionData;
  const parts = [];

  parts.push(<span key="name" className={classes.monospace}>{name}</span>);
  if (args.length > 0) {
    const renderedArgs = args.map((arg, index) => { 
      return <span key={index} className={classes.monospace}>{arg}</span>
    });
    parts.push(<span key="args">arguments: {renderedArgs}</span>);
  }

  if (returnValue != null) {
    const type = typeof(functionData.returnValue);
    let value = returnValue;
    if (type === 'boolean') value = value ? "true" : "false";
    parts.push(<span key="return">returned <span className="monospace">{value}</span> ({type})</span>);
  }

  if (returnRequired && returnValue != null) {
    parts.push(<span key="returnUser">Value from input</span>);
  }

  return (
    <div key={index}>
      <FunctionIcon className={classes.icon}/>
      {parts}
    </div>
  );
}

function renderMessage(classes, index, text) {
  if (text.text != null) {
    return renderText(index, text)
  } else if (text.command != null) {
    return renderCommand(classes, index, text.command);
  } else if (text.nodeEntered != null) {
    return renderNodeEntry(classes, index, text.nodeEntered);
  } else if (text.optionSelected != null) {
    return  renderSelectedOption(classes, index, text.optionSelected);
  } else if (text.variable != null) {
    return renderVariableChange(classes, index, text.variable);
  } else if (text.function != null) {
    return renderFunctionCall(classes, index, text.function);
  }
}

function renderTextArray() {
  const renderedText = [];
  let currentCharacter = null;
  for(let index = 0; index < this.props.text.length; index++) {
    const text = this.props.text[index];
    if (text.dialogSegment != null) {
      currentCharacter = renderDialogSegment(this.props.classes, renderedText, index, currentCharacter, text);
    } else {
      const output = renderMessage(this.props.classes, index, text);
      if (output != null) renderedText.push(output);
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
  const classes = this.props.classes;
  if (this.props.halted) return (<div> <HaltedIcon className={classes.icon}/>Halted</div>);
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
