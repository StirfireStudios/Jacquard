import React from 'react';

// Import Material UI Components
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';

import themes from '../themes';

class DefaultPage extends React.Component {
	render() {
		return (
			<div>
				<Typography>Welcome to Jacquard.</Typography>
				<Typography>
					This is the page where we can see things
					like recent projects, create a new project and load an existing project.
				</Typography>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(DefaultPage);
