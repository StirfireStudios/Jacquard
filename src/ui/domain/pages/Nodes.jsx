import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';

import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';

import { fade } from '@material-ui/core/styles/colorManipulator';

import themes from '../themes';

import Table from '../../general/components/Table';
import TitleBar from '../../general/components/TitleBar';

import * as Actions from '../../../actions/ui/nodes';

const styles = theme => ({
  ...themes.defaultTheme(theme),
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

const columns = [
  { 
    field: "actions", header: "",
    cellFunc: data => {
      return (
        <div>
          <div key="edit">
            <Button color="primary" mini variant="fab">
              <EditIcon/>
            </Button>
          </div>
          <div key="delete">
            <Button color="secondary" mini variant="fab">
              <DeleteIcon/>
            </Button>
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
    <div key={item}>
      <Button variant="raised" size="small" onClick={onClick}>
        {item}
      </Button>
    </div>
  ));
}

function matchesSearch(node, searchString) {
  if (searchString == null) return true;
  if (node.title.indexOf(searchString) !== -1) return true;
  if (node.body.indexOf(searchString) !== -1) return true;
  node.tags.forEach(tag => {
    if (tag.indexOf(searchString) !== -1) return true;
  });
  return false;
}

function generateListData(sections, searchString) {
  const list = [];
  Object.keys(sections).forEach(sectionName => {
    Object.keys(sections[sectionName]).forEach(nodeName => {
      const node = sections[sectionName][nodeName];
      if (matchesSearch(node, searchString)) { 
        list.push({
          index: list.length,
          section: sectionName,
          node: nodeName,
          tags: node.tags,
          outgoingLinks: node.outgoingLinks,
          incomingLinks: node.incomingLinks,
        });
      }
    });
  });
  return list;
}

function rowHeight(data, index) {
  return 40;
}

function onSearchStringChange(event) {
  if (event.target.value.length > 0) {
    Actions.Search(event.target.value);
  } else {
    Actions.Search(null);
  }
}

function renderSearch(props) {
  const { classes, searchString } = props;

  return (
    <div className={classes.search} key="search">
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        value={searchString}
        onChange={onSearchStringChange}
      />
    </div>
  );
}

function renderNewNode(props) {
  const { classes } = props;
  return (
    <IconButton color="inherit">
      <AddIcon />
    </IconButton>    
  )
}

function NodePage(props) {
  const { classes, sections, searchString } = props;

  console.log("Search: ");
  console.log(searchString);

  const listData = generateListData(sections, searchString);
  
  return (
    <Paper className={classes.pageRoot}>
      <TitleBar title="Nodes">
        {renderSearch(props)}
        {renderNewNode(props)}
      </TitleBar>
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
  const UI = state.UI.Nodes;
  return {
    sections: Project.sections,
    searchString: UI.searchString,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(NodePage));
