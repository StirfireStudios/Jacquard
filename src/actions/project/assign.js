import { assignAll } from 'redux-act';

import * as Import from './import'
import * as Load from './load'
import * as Save from './save'

const actions = [Import, Load, Save];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
