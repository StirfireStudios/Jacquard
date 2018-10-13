import { createReducer } from 'redux-act';

import * as ImportActions from '../../actions/project/import'
import * as LoadActions from '../../actions/project/load'
import * as MiscActions from '../../actions/project/misc'
import * as SaveActions from '../../actions/project/save'

const defaultProject = {
  parser: null,
  settings: {},
  sections: {},
  characters: [],
  characterMap: {},
  functions: [],
  functionMap: {},
  variables: [],
  variableMap: {},
}

export default createReducer({
  [MiscActions.ChangeSettings]: (state, updatedSettings) => {
    const newSettings = Object.assign({}, state.settings, updatedSettings);
    return {
      ...state,
      settings: newSettings,
      dirty: true,
    };
  },
  [ImportActions.LoadFinish]: (state, newData) => ({
    ...state,
    busy: false,
    dirty: true,
    parser: newData.parser,
    characters: newData.characters,
    characterMap: newData.characterMap,
    functions: newData.functions,
    functionMap: newData.functionMap,
    settings: newData.settings,
    sections: newData.sections,
    tags: newData.tags,
    variables: newData.variables, 
    variableMap: newData.variableMap,
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
    settings: newData.settings,
    path: newData.path,
    parser: newData.parser,
    characters: newData.characters,
    characterMap: newData.characterMap,
    functions: newData.functions,
    functionMap: newData.functionMap,
    settings: newData.settings,
    sections: newData.sections,
    tags: newData.tags,
    variables: newData.variables, 
    variableMap: newData.variableMap,
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
  [MiscActions.Reset]: (state) => ({
    ...state,
    ...defaultProject,
    busy: false,
    errors: [],
    path: null,
    dirty: false,
  }),
}, {
  ...defaultProject,
  busy: false,
  errors: [],
  path: null,
});
