import React from 'react';

import { withStyles } from 'material-ui/styles';
import themes from '../themes';
// import Modal from 'material-ui/Modal';
// import Button from 'material-ui/Button';

import ModalDialog from '../../general/components/ModalDialog';

class NodeEditor extends React.Component {
	render() {
		console.log(`rendering the form. Open is ${this.props.open}`);
		return (
			<ModalDialog
				close={this.props.close}
				title="Node Editor"
				description="Allows you to edit the node"
				open={this.props.open}
			>
				<div>This is some content for the form</div>
			</ModalDialog>
		);
	}
}

export default withStyles(themes.defaultTheme)(NodeEditor);

