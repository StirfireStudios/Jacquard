import React from 'react';

// Import Material UI Components
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';

import themes from '../themes';

class RuntimePage extends React.Component {
	render() {
		return (
			<div>
				We made a runtime page!
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(RuntimePage);
