import { createAction } from 'redux-act';

export const Start = createAction('Project Load - started');
export const Error = createAction('Project Load - error');
export const Complete = createAction('Project Load - complete', (path, data) => ({path, data}));
