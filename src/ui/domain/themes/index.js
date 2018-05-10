const drawerWidth = 240;

const defaultTheme = function defaultTheme(theme) {
	return {
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
			backgroundColor: theme.palette.background.default,
			width: '100%',
			padding: theme.spacing.unit * 3,
			height: 'calc(100% - 56px)',
			marginTop: 56,
			[theme.breakpoints.up('sm')]: {
				height: 'calc(100% - 64px)',
				marginTop: 64,
			},
		},
	};
};

export default { defaultTheme };
