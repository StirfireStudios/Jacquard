import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

import uuidv4 from 'uuid/v4';

import ListEditButton from './ListEditButton';
import ListDeleteButton from './ListDeleteButton';
import { TableFooter } from '@material-ui/core';

const styles = theme => ({
	header: {
		backgroundColor: theme.palette.background.paper,
		position: 'sticky',
		top: 0,
		zIndex: 999,
	},
});

function handleChangePage(event, page) {
	this.setState({page: page});
}

function handleChangeRowsPerPage(event) {
	this.setState({limit: event.target.value});
}

function paginate(rows, limit, page) {
	if (rows == null) return [];
	if (rows.length < limit * (page - 1)) return [];
	const inPage = [];
	let index = limit * page;
	while(index < rows.length && index < limit * (page + 1)) {
		inPage.push(rows[index]);
		index++;
	}
	return inPage;
}

function renderHeaders(fields, headerClass) {
	const cells = fields.map(field => {
		return (
			<TableCell className={headerClass} key={field.name}>
				{field.displayName}
			</TableCell>
		);
	});

	return (
		<TableRow>
			{cells}
			<TableCell className={headerClass} key="item_actions"/>
		</TableRow>
	);
}

function renderPagination(rows, limit, page, onChangePage, onChangeRowsPerPage) {	
	if (rows == null) return null;
	if (rows.length - page * limit < 0) return null;

	return (
		<TablePagination
			count={rows.length}
			rowsPerPage={limit}
			page={page}
			onChangePage={onChangePage}
			onChangeRowsPerPage={onChangeRowsPerPage}
		/>
	)

}

class FieldListTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
			limit: 10
		}
	}

	renderFields = item => this.props.fields.map(field => (
		<TableCell key={field.name}>
			{
				field.getContentCallback(
					item,
					field.name,
					this.props.onAddItemClick,
					this.props.onEditItemClick,
				)
			}
		</TableCell>
	));

	renderRows = () => {
		if (this.props.rows == null) return null;

		return paginate(this.props.rows, this.state.limit, this.state.page).map(item => (
			<TableRow key={uuidv4()}>
				{this.renderFields(item)}
				<TableCell>
					<ListEditButton
						onClick={() => this.props.onEditItemClick(item[this.props.keyName])}
						itemKey={item[this.props.keyName]}
					/>
					<ListDeleteButton
						onClick={() => this.props.onDeleteItemClick(item[this.props.keyName])}
						itemKey={item[this.props.keyName]}
					/>
				</TableCell>
			</TableRow>
		));
	}

	render() {
		// Render the header
		const header = renderHeaders(this.props.fields, this.props.classes.header)

		// Render the rows
		const rows = this.renderRows();

		const pagination = renderPagination(
			this.props.rows, 
			this.state.limit,
			this.state.page,
			handleChangePage.bind(this),
			handleChangeRowsPerPage.bind(this),
		);

		return (
			<Table>
				<TableHead>
					{pagination}
					{header}					
				</TableHead>
				<TableBody>
					{rows}
				</TableBody>
				<TableFooter>
					{pagination}
				</TableFooter>
			</Table>
		);
	}
}

FieldListTable.defaultProps = {
	rows: [],
};

FieldListTable.propTypes = {
	rows: PropTypes.array,
	keyName: PropTypes.string.isRequired,
	fields: PropTypes.array.isRequired,
	onAddItemClick: PropTypes.func.isRequired,
	onEditItemClick: PropTypes.func.isRequired,
	onDeleteItemClick: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(FieldListTable);
