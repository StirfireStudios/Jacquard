import { assignAll } from 'redux-act';

import exportAssign from './export/assign';
import previewAssign from './preview/assign';

const subtrees = [exportAssign, previewAssign];

const actions = [];

export default function(store) {
  subtrees.forEach((assignFunc) => {
    assignFunc(store);
  });

  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
