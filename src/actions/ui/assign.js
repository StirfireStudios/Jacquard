import { assignAll } from 'redux-act';

import * as Menu from './menu'
import * as Nodes from './nodes'

const actions = [Menu, Nodes];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
