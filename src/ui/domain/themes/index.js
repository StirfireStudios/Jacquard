import orange from '@material-ui/core/colors/orange';
import blue from '@material-ui/core/colors/blue';


const drawerWidth = 240;

function defaultTheme(theme) {
	return {
		...theme,
		root: {
			width: '100%',
			height: '100%',
			zIndex: 1,
			overflow: 'hidden',
		},
		appFrame: {
			position: 'relative',
			display: 'flex',
			width: '100%',
			height: '100%',
		},
		appBar: {
			position: 'absolute',
			width: `calc(100% - ${drawerWidth}px)`,
		},
		'appBar-left': {
			marginLeft: drawerWidth,
		},
		'appBar-right': {
			marginRight: drawerWidth,
		},
		drawerPaper: {
			position: 'relative',
			height: '100%',
			width: drawerWidth,
		},
		drawerHeader: theme.mixins.toolbar,
		content: {
			width: '100%',
			height: 'calc(100% - 56px)',
			[theme.breakpoints.up('sm')]: {
				height: 'calc(100% - 64px)',
			},
			overflow: 'auto',
		},
		pageRoot: {
			flexGrow: 1,
			width: '100%',
		},
		dataChanged: {
			backgroundColor: orange[500],
		},
		selected: {
			backgroundColor: blue[500],
		}
	};
};

export default { defaultTheme };
