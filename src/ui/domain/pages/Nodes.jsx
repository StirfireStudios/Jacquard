import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';

import themes from '../themes';

import TitleBar from '../../general/components/TitleBar';

const columns = [
  { name: "actions", header: "", width: "5%"},
  { name: "section", header: "Section"},
  { name: "node", header: "Title"},
  { 
    name: "tags", header: "Tags", 
    cell: data => data.tags.map(tag => <div><Button>{tag}</Button></div>)
  },
  { name: "incoming", header: "Incoming"},
  { name: "outgoing", header: "Outgoing"},
  { name: "valid", header: "Valid"},
];

function generateListData(sections) {
  const list = [];
  Object.keys(sections).forEach(sectionName => {
    Object.keys(sections[sectionName]).forEach(nodeName => {
      const node = sections[sectionName][nodeName];
      list.push({
        section: sectionName,
        node: nodeName,
        tags: node.tags,
        outgoingLinks: node.outgoingLinks,
        incomingLinks: node.incomingLinks,
      });
    });
  });
  return list;
}

function NodePage(props) {
  const { classes, sections } = props;

  const listData = generateListData(sections);
  
  return (
    <Paper className={classes.pageRoot}>
      <TitleBar title="Nodes"/>
    </Paper>
  );
}

function mapStateToProps(state) {
  const Project = state.Project;
  return {
    sections: Project.sections,
  }
}

export default connect(mapStateToProps)(withStyles(themes.defaultTheme)(NodePage));
