import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

function columns(columnProps) {
  return columnProps.map(column => {
    return {
      name: column.header,
    }
  });
}

function renderHeader(columns) {
  const headers = [];
  columns.forEach(column => {
    headers.push(
      <TableCell key={column.field}>
        {column.header}
      </TableCell>
    );
  });

  return (
    <TableHead key="head">
      <TableRow key="headRow">
        {headers}        
      </TableRow>
    </TableHead>
  );
}

function renderRows(data, columns) {
  return data.map((item) => {
    const cells = columns.map((column => {
      let value = null;
      if (column.cellFunc != null) {
        value = column.cellFunc(item);
      } else {
        value = item[column.field];
      }
      return <TableCell key={column.field} children={value}/>;
    }));
    return <TableRow key={item.index} children={cells}/>;
  });
}

function renderPagination(length, state) {
  return (
  <TablePagination
		component="div"
		count={length}
		rowsPerPage={state.limit}
		rowsPerPageOptions={[10,20,30,40,50]}
		page={state.page}
		backIconButtonProps={{
			'aria-label': 'Previous Page',
		}}
		nextIconButtonProps={{
			'aria-label': 'Next Page',
		}}
//		onChangePage={bindableFetch(busy, props.limit, props.fetchAction)}
//		onChangeRowsPerPage={bindableFetch(busy, props.limit, props.fetchAction)}
	/>);
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
      <div>
        <Table>
          {renderHeader(this.props.columns)}
          <TableBody>
            {renderRows(dataToRender, this.props.columns)}
          </TableBody>
        </Table>
        {renderPagination(this.props.data.length, this.state)}
      </div>
      );
  }
}

export default JQRDTable;
