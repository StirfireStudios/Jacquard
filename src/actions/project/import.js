import { createAction } from 'redux-act';

export const LoadStart = createAction('Project Import - load started');
export const LoadError = createAction('Project Import - load error');
export const LoadFinish = createAction('Project Import - load complete');
export const Refresh = createAction('Project Import - refresh data');
