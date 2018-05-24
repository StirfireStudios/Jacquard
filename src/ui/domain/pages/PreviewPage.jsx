import React from 'react';

import { withStyles } from 'material-ui/styles';

import themes from '../themes';

import ValidationPanel from '../components/Preview/ValidationPanel';

class RuntimePage extends React.Component {	
	render() {
		return (
			<div>
				<ValidationPanel project={this.props.project}/>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(RuntimePage);
