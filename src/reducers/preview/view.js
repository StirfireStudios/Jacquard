import { createReducer } from 'redux-act';

//import * as RuntimeActions from '../../actions/preview/runtime';
import * as ViewActions from '../../actions/preview/view';

export default createReducer({
  [ViewActions.ChangeVisibility]: (state, data) => {
    const newState = {...state};
    const stateKey = `show${data.key}`
    if (newState[stateKey] === undefined) return newState;
    newState[stateKey] = data.show;
    return newState;
  },
},{
  showCharacters: false,
  showState: false,
  showVariables: false,
  showNodeHistory: false,
  showNodeNames: false,
});
