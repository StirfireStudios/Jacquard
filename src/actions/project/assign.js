import { assignAll } from 'redux-act';

import * as Save from './save'
import * as Import from './import'

const actions = [Save, Import];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
