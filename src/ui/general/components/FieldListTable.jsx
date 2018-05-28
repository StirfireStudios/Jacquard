import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import uuidv4 from 'uuid/v4';

import ListEditButton from './ListEditButton';
import ListDeleteButton from './ListDeleteButton';

const styles = theme => ({
	header: {
		backgroundColor: theme.palette.background.paper,
		position: 'sticky',
		top: 0,
		zIndex: 999,
	},
});

class FieldListTable extends React.Component {
	renderHeader = () => (
		<TableHead>
			<TableRow>
				{this.props.fields.map(field => (
					<TableCell
						className={this.props.classes.header}
						key={field.name}
					>
						{field.displayName}
					</TableCell>
				))}
				<TableCell className={this.props.classes.header} />
			</TableRow>
		</TableHead>
	);

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
		let returnValue = [];

		if (this.props.rows) {
			returnValue = this.props.rows.map(item => (
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

		return returnValue;
	}

	render() {
		// Render the header
		const header = this.renderHeader();

		// Render the rows
		const rows = this.renderRows();

		return (
			<Table>
				{header}
				<TableBody>
					{rows}
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
	fields: PropTypes.array.isRequired,
	onAddItemClick: PropTypes.func.isRequired,
	onEditItemClick: PropTypes.func.isRequired,
	onDeleteItemClick: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(FieldListTable);
