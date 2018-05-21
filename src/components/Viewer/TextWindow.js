import React, { Component } from 'react';

function renderText(index, string) {
  return <div key={index} className="text">{string}</div>;
}

function renderCommand(index, args) {
  console.log("rendering command");
  console.log("ARGS");
  console.log(args);
  const renderedArgs = [];
  for(let index = 0; index < args.length; index++) {
    renderedArgs.push(<span key={index} className="argument">{args[index]}</span>);
  }

  return <div key={index} className="command">{renderedArgs}</div>;
}

function renderNodeEntry(index, nodeName) {
  return <div key={index} className="nodeEntry">{nodeName}</div>;
}

function renderSelectedOption(index, selectedOption) {
  const text = [];
  for(let index = 0; index < selectedOption.text.length; index++) {
    const textLine = selectedOption.text[index];
    if (textLine.text == null) continue;
    text.push(<span key={index} className="optionText">{textLine.text}</span>);
  }

  return <div key={index} className="selectedOption">{text}</div>;
}

function renderVariableChange(index, variableData) {
  let type = typeof(variableData.value);
  if (variableData.type === "save") {
    return <div key={index} className="variableSave">{variableData.name} is now {variableData.value} ({type})</div>;
  } else {
    return <div key={index} className="variableLoad">loaded {variableData.value} ({type}) from {variableData.name}</div>;
  }
}


function renderTextArray() {
  const renderedText = [];
  for(let index = 0; index < this.props.text.length; index++) {
    const text = this.props.text[index];
    if (text.text != null) {
      renderedText.push(renderText(index, text.text));
    } else if (text.command != null) {
      renderedText.push(renderCommand(index, text.command));
    } else if (text.nodeEntered != null) {
      renderedText.push(renderNodeEntry(index, text.nodeEntered));
    } else if (text.optionSelected != null) {
      renderedText.push(renderSelectedOption(index, text.optionSelected));
    } else if (text.variable != null) {
      renderedText.push(renderVariableChange(index, text.variable));
    }
  }
  return renderedText;
}


function renderOptions() {
  const options = [];
  const optionSelect = this.props.optionSelect;
  let optionIndex = 0;


  if (this.props.options != null) {
    for(let option of this.props.options) {
      const action = optionSelect.bind(null, option);
      options.push(
        <div key={optionIndex}>
          <button onClick={action}>{option.text[0].text}</button>
        </div>
      )
      optionIndex++;
    }
  }

  return options;
}

export default class TextWindow extends Component {
  render() {
    return (
      <div key={this.props.key} className={this.props.className}>
        {renderTextArray.call(this)}
        {renderOptions.call(this)}
      </div>
    )
  }
}