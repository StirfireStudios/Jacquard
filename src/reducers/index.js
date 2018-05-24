import { combineReducers } from 'redux'
import runtimeSourceData from './runtime/sourceData';
import runtimeState from './runtime/state';
import runtimeView from './runtime/view';


export default function(state, action) {
  if (state == null) state = { Runtime: {} }
  return {
    Runtime: {
      SourceData: runtimeSourceData(state.Runtime.SourceData, action),
      State: runtimeState(state.Runtime.State),
      View: runtimeView(state.Runtime.View, action),
    }
  }
}
