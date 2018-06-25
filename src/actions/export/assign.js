import { assignAll } from 'redux-act';

import * as Bytecode from './bytecode'

const actions = [Bytecode];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
