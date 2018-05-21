import { assignAll } from 'redux-act';

import * as Data from './data'
import * as Runtime from './runtime';
import * as View from './view';

const actions = [Data, Runtime, View];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
