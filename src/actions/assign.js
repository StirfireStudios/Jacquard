import { assignAll } from 'redux-act';

import exportAssign from './export/assign';
import previewAssign from './preview/assign';
import projectAssign from './project/assign';
import miscAssign from './misc/assign';

const subtrees = [exportAssign, previewAssign, projectAssign, miscAssign];

const actions = [];

export default function(store) {
  subtrees.forEach((assignFunc) => {
    assignFunc(store);
  });

  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
