import { createReducer } from 'redux-act';

import * as ImportActions from '../../actions/project/import'

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
}, {
  busy: false,
  dirty: false,
  parser: null,
  settings: {},
  sections: {},
  characters: [],
  functions: [],
  variables: [],
});
