import { createReducer } from 'redux-act';

import * as ImportActions from '../../actions/project/import'
import * as LoadActions from '../../actions/project/load'
import * as SaveActions from '../../actions/project/save'

export default createReducer({
  [ImportActions.LoadFinish]: (state, newData) => ({
    ...state,
    busy: false,
    dirty: true,
    parser: newData.parser,
    characters: newData.characters,
    functions: newData.functions,
    settings: newData.settings,
    sections: newData.sections,
    tags: newData.tags,
    variables: newData.variables, 
  }),
  [LoadActions.Start]: (state) => ({
    ...state,
    busy: true,
    errors: [],
  }),
  [LoadActions.Complete]: (state, newData) => ({
    ...state,
    busy: false,
    dirty: false,
    errors: [],
    parser: newData.parser,
    characters: newData.characters,
    functions: newData.functions,
    settings: newData.settings,
    sections: newData.sections,
    tags: newData.tags,
    variables: newData.variables,
  }),
  [SaveActions.Start]: (state) => ({
    ...state,
    busy: true,
    errors: [],      
  }),
  [SaveActions.Complete]: (state, path) => ({
    ...state,
    busy: false,
    path: path,
    dirty: false,
  }),
}, {
  busy: false,
  errors: [],
  path: null,
  dirty: false,
  parser: null,
  settings: {},
  sections: {},
  characters: [],
  functions: [],
  variables: [],
});
