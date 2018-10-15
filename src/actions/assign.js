import { assignAll } from 'redux-act';

import exportAssign from './export/assign';
import previewAssign from './preview/assign';
import projectAssign from './project/assign';
import uiAssign from './ui/assign';

const subtrees = [exportAssign, previewAssign, projectAssign, uiAssign];

const actions = [];

export default function(store) {
  subtrees.forEach((assignFunc) => {
    assignFunc(store);
  });

  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
