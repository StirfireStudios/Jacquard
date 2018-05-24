import { createReducer } from 'redux-act';

import * as DataActions from '../../actions/preview/sourceData';

function dupeArray(array) {
  return array.map((item) => (item));
}

function filterArray(array, removeItem) {
  return array.filter((item) => (item !== removeItem));
}

export default createReducer({
  [DataActions.Compiling]: (state) => ({
    ...state,
    compiling: true,
    errors: [],
  }),
  [DataActions.Compiled]: (state) => ({
    ...state,
    compiling: false,
    valid: true,
    errors: [],
  }),
  [DataActions.CompileErrors]: (state, errors) => ({
    ...state,
    compiling: false,
    valid: false,
    errors: dupeArray(errors),
  }),
  [DataActions.Updated]: (state) => {
    if (state.compiling) {
      console.log("Need to cancel outstanding compile!");
    }
    return {
      ...state,
      valid: false,
    };
  },
}, {
  compiling: false,
  valid: false,
  logic: null,
  dialog: null,
  sourceMap: null,
  errors: [],
});
