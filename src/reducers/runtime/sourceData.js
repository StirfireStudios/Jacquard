import { createReducer } from 'redux-act';

import * as DataActions from '../../actions/data';

function dupeArray(array) {
  return array.map((item) => (item));
}

function filterArray(array, removeItem) {
  return array.filter((item) => (item !== removeItem));
}

function dataTypeInvalid(type) {
  return !(type === "logic" || type === "dialogue" || type === "sourceMap")
}

export default createReducer({
  [DataActions.LoadStarted]: (state, filename) => {
    const newOutstanding = dupeArray(state.outstandingLoads);
    newOutstanding.push(filename);
    const newErrors = Object.assign({}, state.errors);
    delete(newErrors[filename]);
    return {
      ...state,
      outstandingLoads: newOutstanding,
    }
  },
  [DataActions.LoadComplete]: (state, data) => {
    const newOutstanding = filterArray(state.outstandingLoads, data.fileName);
    if (dataTypeInvalid(data.type)) {
      console.error(`Unknown data type ${data.type} loaded request`);
      return;
    }

    const newState = {
      ...state,
      outstandingLoads: newOutstanding,
    }
    newState[data.type] = data.fileName;
    return newState;
  },
  [DataActions.UnloadFile]: (state, type) => {
    if (dataTypeInvalid(type)) {
      console.error(`Unknown data type ${type} unload request`);
      return;
    }

    const newState = { ...state }
    newState[type] = null;
    return newState;
  },
  [DataActions.ErrorLoading]: (state, data) => {
    const newOutstanding = filterArray(state.outstandingLoads, data.fileName);
    const newErrors = Object.assign({}, state.errors);
    newErrors[data.fileName] = data.error;
    return {
      ...state,
      outstandingLoads: newOutstanding,
      errors: newErrors,
    }
  },
}, {
  outstandingLoads: [],
  logic: null,
  dialog: null,
  sourceMap: null,
  errors: {},
});
