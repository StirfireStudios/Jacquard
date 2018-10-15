import { createReducer } from 'redux-act';

import * as Actions from '../actions/misc/menu';

export default createReducer({
	[Actions.Hide]: (state) => ({
		...state,
		visible: false,
	}),
	[Actions.Show]: (state) => ({
		...state,
		visible: true,
	}),
	[Actions.Toggle]: (state) => ({
		...state,
		visible: !state.visible,
	}),
}, {
		visible: false
});
