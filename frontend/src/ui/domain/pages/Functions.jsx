import React from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import themes from '../themes';

class Functions extends React.Component {
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
							<TableCell>currentDifficulty(difficulty)</TableCell>
							<TableCell>
								Checks what our ciurrent difficulty is.
								On Argument - string:
								- hard
								- medium
								- easy
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(Functions);
