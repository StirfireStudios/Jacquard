import { assignAll } from 'redux-act';

import * as SourceData from './sourceData'
import * as Runtime from './runtime';
import * as View from './view';

const actions = [SourceData, Runtime, View];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
