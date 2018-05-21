import React from 'react';

// Import Material UI Components
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';

import themes from '../themes';

import yarnService from '../../../services/yarnService';
import yarnCompiler from 'jacquard-yarncompiler';
import CurrentMode from '../../../components/CurrentMode';
import DevTools from '../../../components/DevTools';


// const yarnParser = yarnService.parser;
// yarnCompiler.process(yarnParser);
// yarnCompiler.assemble();
// yarnCompiler



class RuntimePage extends React.Component {
	
	render() {
		return (
			<div>
				<CurrentMode/>
				<DevTools/>
			</div>
		);
	}
}

export default withStyles(themes.defaultTheme)(RuntimePage);
