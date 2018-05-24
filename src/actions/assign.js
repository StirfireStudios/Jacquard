import { assignAll } from 'redux-act';

import previewAssign from './preview/assign';

const subtrees = [previewAssign];

const actions = [];

export default function(store) {
  subtrees.forEach((assignFunc) => {
    assignFunc(store);
  });

  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
