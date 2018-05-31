import { createAction } from 'redux-act';

export const LoadFile = createAction('Runtime - load data');
export const Activate = createAction('Runtime - activate');
export const Reset = createAction('Runtime - Reset');
export const Run = createAction('Runtime - Run to option');
export const RunStep = createAction('Runtime - Run to step');
export const OptionSelect = createAction('Runtime - select option');
export const FuncValue = createAction('Runtime - return the value of a function');
export const MoveToNode = createAction('Runtime - start at a node');
export const Pause = createAction('Runtime - Pause');
