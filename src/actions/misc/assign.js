import { assignAll } from 'redux-act';

import * as Menu from './menu'

const actions = [Menu];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
