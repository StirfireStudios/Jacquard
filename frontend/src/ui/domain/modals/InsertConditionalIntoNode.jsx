import React from 'react';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import themes from '../themes';
import ModalDialog from '../../general/components/ModalDialog';

class InsertConditionalIntoNode extends React.Component {
	render() {
		return (
			<ModalDialog
				title="Insert Conditional"
				open={this.props.open}
				handleClose={this.props.handleClose}
			>
				<div>Do we need variable lookups for any of these fields?</div>
				<TextField
					id="if"
					label="If"
					fullWidth
				/>
				<TextField
					id="is"
					label="Is"
					fullWidth
				/>
				<TextField
					id="then"
					label="Then"
					fullWidth
					multiline
					rows="4"
				/>
				<TextField
					id="else"
					label="Else"
					fullWidth
					multiline
					rows="4"
				/>
			</ModalDialog>
		);
	}
}

export default withStyles(themes.defaultTheme)(InsertConditionalIntoNode);
