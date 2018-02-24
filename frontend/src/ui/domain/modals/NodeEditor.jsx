import React from 'react';

import { withStyles } from 'material-ui/styles';
import themes from '../themes';
// import Modal from 'material-ui/Modal';
// import Button from 'material-ui/Button';

import ModalForm from '../../general/components/ModalForm';

class NodeEditor extends React.Component {
	render() {
		console.log(`rendering the form. Open is ${this.props.open}`);
		return (
			<ModalForm
				close={this.props.close}
				title="Node Editor"
				description="Allows you to edit the node"
				open={this.props.open}
			>
				<div>This is some content for the form</div>
			</ModalForm>
		);
	}
}

export default withStyles(themes.defaultTheme)(NodeEditor);

