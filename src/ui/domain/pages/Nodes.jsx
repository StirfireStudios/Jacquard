import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';

import themes from '../themes';

import Table from '../../general/components/Table';
import TitleBar from '../../general/components/TitleBar';

const columns = [
  { 
    field: "actions", header: "",
    cellFunc: data => {
      return (
        <div>
          <div>
            <Button
              variant="fab"
              key="edit"
              mini
              children={EditIcon}
            />
          </div>
          <div>
            <Button
              variant="fab"
              key="delete"
              mini
              children={DeleteIcon}
            />
          </div>
        </div>
      )
    },
  },
  { field: "section", header: "Section"},
  { field: "node", header: "Title"},
  { 
    field: "tags", header: "Tags", 
    cellFunc: data => renderListButtons(data.tags),
  },
  { 
    field: "incomingLinks", header: "Incoming",
    cellFunc: data => renderListButtons(data.incomingLinks),
  },
  { 
    field: "outgoingLinks", header: "Outgoing",
    cellFunc: data => renderListButtons(data.outgoingLinks),
  },
  { field: "valid", header: "Valid"},
];

function renderListButtons(list, onClick) {
  return list.map(item => (
    <div>
      <Button variant="raised" size="small" onClick={onClick}>
        {item}
      </Button>
    </div>
  ));
}

function generateListData(sections) {
  const list = [];
  Object.keys(sections).forEach(sectionName => {
    Object.keys(sections[sectionName]).forEach(nodeName => {
      const node = sections[sectionName][nodeName];
      list.push({
        index: list.length,
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

function rowHeight(data, index) {
  return 40;
}

function NodePage(props) {
  const { classes, sections } = props;

  const listData = generateListData(sections);
  
  return (
    <Paper className={classes.pageRoot}>
      <TitleBar title="Nodes"/>
      <div className={classes.content}>
        <Table
          columns={columns}
          data={listData}
          getRowHeight={rowHeight.bind(null, listData)}
        />
      </div>
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
