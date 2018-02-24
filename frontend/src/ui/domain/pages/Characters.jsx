import React from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import themes from '../themes';

class Characters extends React.Component {
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
							<TableCell>Ghoul</TableCell>
							<TableCell>Gary - a dominar of the Cabal</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(Characters);
