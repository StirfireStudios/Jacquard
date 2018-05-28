import { createReducer } from 'redux-act';

//import * as RuntimeActions from '../../actions/preview/runtime';
import * as ViewActions from '../../actions/preview/view';

export default createReducer({
  [ViewActions.ToggleVisibility]: (state, data) => {
    const newState = {...state};
    const stateKey = `show${data}`
    console.log(`toggle State: ${stateKey}`);
    if (newState[stateKey] === undefined) return newState;
    newState[stateKey] = !state[stateKey];
    return newState;
  },
},{
  showCharacters: false,
  showState: false,
  showVariables: false,
  showNodes: false,
});
