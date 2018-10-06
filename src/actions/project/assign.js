import { assignAll } from 'redux-act';

import * as Import from './import'

const actions = [Import];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
