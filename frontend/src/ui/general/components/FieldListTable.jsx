import React from 'react';
import PropTypes from 'prop-types';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import ListEditButton from './ListEditButton';
import ListDeleteButton from './ListDeleteButton';

class FieldListTable extends React.Component {
	FieldTableCells(item) {
		return this.props.fields.map(field => (<TableCell key={field}>{item[field]}</TableCell>));
	}

	Header = () => (<TableHead>
		<TableRow>
			{this.props.displayNames.map(displayName => <TableCell key={displayName}>{displayName}</TableCell>)}
			<TableCell />
		</TableRow>
	</TableHead>);

	DisplayFields = item => this.props.fieldNames.map(fieldName => (
		<TableCell key={fieldName}>{item[fieldName]}</TableCell>
	));

	Rows = () => {
		let returnValue = [];

		if (this.props.rows) {
			returnValue = this.props.rows.map(item => (<TableRow key={item[this.props.keyName]}>
				{this.DisplayFields(item)}
				<TableCell>
					<ListEditButton onClick={() => this.props.onEditClick(item[this.props.keyName])} itemKey={item[this.props.keyName]} />
					<ListDeleteButton onClick={() => this.props.onDeleteClick(item[this.props.keyName])} itemKey={item[this.props.keyName]} />
				</TableCell>
			</TableRow>));
		}

		return returnValue;
	}

	render() {
		return (
			<Table>
				<this.Header />
				<TableBody>
					<this.Rows />
				</TableBody>
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
	fieldNames: PropTypes.array.isRequired,
	displayNames: PropTypes.array.isRequired,
	onEditClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
};

export default FieldListTable;
