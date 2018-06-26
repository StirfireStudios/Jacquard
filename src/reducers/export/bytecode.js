import { createReducer } from 'redux-act';

import * as Actions from '../../actions/export/bytecode';


export default createReducer({
  [Actions.Exporting]: (state) => ({
    ...state,
    exporting: true,
    error: null,
  }),
  [Actions.Error]: (state, error) => ({
    ...state,
    exporting: false,
    error: error,
  }),
  [Actions.Complete]: (state) => ({
    ...state,
    exporting: false,
    error: null,
  }),
}, {
  exporting: false,
  error: null,
});
