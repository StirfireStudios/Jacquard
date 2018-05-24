import { combineReducers } from 'redux'
import previewSourceData from './preview/sourceData';
import previewState from './preview/state';
import previewView from './preview/view';

export default function(state, action) {
  if (state == null) state = { Preview: {} }
  return {
    Preview: {
      SourceData: previewSourceData(state.Preview.SourceData, action),
      State: previewState(state.Preview.State),
      View: previewView(state.Preview.View, action),
    }
  }
}
