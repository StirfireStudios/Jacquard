import React from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import themes from '../themes';

class Variables extends React.Component {
	render() {
		return (
			<div>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Description</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>dogEaten</TableCell>
							<TableCell>Has the player eaten the dog as food?</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(Variables);
