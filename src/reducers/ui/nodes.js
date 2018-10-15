import { createReducer } from 'redux-act';

import * as Actions from '../../actions/ui/nodes'

export default createReducer({
	[Actions.Search]: (state, searchString) => ({
		...state,
		searchString: searchString
	}),
	[Actions.Add]: (state) => ({
		...state,
	}),
}, {
	searchString: null
});
