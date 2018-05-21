import { combineReducers } from 'redux'
import Data from './data';
import Runtime from './runtime';
import View from './view';

const rootReducer = combineReducers({
  Data,
  Runtime,
  View,
})

export default rootReducer
