import { createAction } from 'redux-act';

export const Activate = createAction('Runtime - activate');
export const Deactivate = createAction('Runtime - deactivate');
export const Run = createAction('Runtime - Run to option');
export const RunStep = createAction('Runtime - Run to step');
export const OptionSelect = createAction('Runtime - select option');
export const MoveToNode = createAction('Runtime - start at a node');
export const Pause = createAction('Runtime - Pause');