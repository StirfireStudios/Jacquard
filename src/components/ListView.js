import React, { Component } from 'react';

function renderHideButton() {
  if (this.props.hideFunc != null) {
    return (
      <button onClick={this.props.hideFunc}>Hide</button>
    );
  }
}

function defaultLineRenderer(value) {
  return (<span>{value}</span>);
}

export default class ListView extends Component {
  render() {
    const list = [];
    let lineRenderer = this.props.lineRenderer;
    console.log(typeof(lineRenderer));
    if (typeof(lineRenderer) !== 'function') lineRenderer = defaultLineRenderer; 

    for(let index = 0; index < this.props.list.length; index++) {
      list.push(
        <div key={index}>{lineRenderer(this.props.list[index])}</div>
      );
    }

    return (
      <div key={this.props.name} className={[this.props.name, "listView"].join(" ")}>
        {renderHideButton.call(this)}
        {list}
      </div>
    )
  }
}