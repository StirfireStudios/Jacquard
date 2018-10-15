import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  tableBody: {
    'grid-area': 'body-scrollable',
    overflowY: 'auto',
    height: 'calc(100%-60px)',
  },
  tableWrapper: {
    overflowX: 'auto',
    height: '100%',
    width: '100%'
  },
  table: {
    height: '100%',
  },
  tableHeader: {
  },
  tableCell: {
    'padding-left': '4px',
    'padding-right': '10px',
  }
});

function renderHeader(columns, className, classes) {
  const headers = [];
  columns.forEach(column => {
    headers.push(
      <TableCell key={column.field} className={classes.tableCell}>
        {column.header}
      </TableCell>
    );
  });

  return (
    <TableHead key="head" className={className}>
      <TableRow key="headRow">
        {headers}        
      </TableRow>
    </TableHead>
  );
}

function renderRows(data, columns, classes) {
  return data.map((item) => {
    const cells = columns.map((column => {
      let value = null;
      if (column.cellFunc != null) {
        value = column.cellFunc(item);
      } else {
        value = item[column.field];
      }
      return <TableCell key={column.field} children={value} className={classes.tableCell}/>;
    }));
    return <TableRow key={item.index} children={cells}/>;
  });
}

function changeState(event, page) {
  let limit = this.state.limit;

  if (event != null) {
    if (parseInt(event.target.value,10).toString() == event.target.value) {
      limit = event.target.value;
    }
  }

  if (typeof(page) !== 'number') page = this.state.page;
  this.setState({...this.state, limit: limit, page: page})

}

function renderPagination() {
  const length = this.props.data.length;
  const state = this.state;

  return (
    <TablePagination
      component="div"
      count={length}
      rowsPerPage={state.limit}
      rowsPerPageOptions={[5,10,20,30]}
      page={state.page}
      backIconButtonProps={{
        'aria-label': 'Previous Page',
      }}
      nextIconButtonProps={{
        'aria-label': 'Next Page',
      }}
      onChangePage={changeState.bind(this)}
      onChangeRowsPerPage={changeState.bind(this)}
    />
  );
}

class JQRDTable extends React.Component {
  constructor() {
    super();
    this.state = {
      page: 0,
      limit: 20,
    }
  }

  render() {
    const options = {
      selectableRows: false,
    }

    const dataToRender = this.props.data.slice(this.state.limit * this.state.page, this.state.limit * (this.state.page + 1));

    if (this.props.options != null) Object.assign(options, this.props.options);

    return (
      <div className={this.props.classes.tableWrapper}>
        <Table className={this.props.classes.table}>
          {renderHeader(this.props.columns, this.props.classes.tableHeader, this.props.classes)}
          <TableBody className={this.props.classes.tableBody}>
            {renderRows(dataToRender, this.props.columns, this.props.classes)}
          </TableBody>
        </Table>
        {renderPagination.call(this)}
      </div>
      );
  }
}

export default withStyles(styles)(JQRDTable);
