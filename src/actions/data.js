import { createAction } from 'redux-act';

export const LoadStarted = createAction('Data - Load Started');
export const LoadComplete = createAction('Data - Load completed', (type, fileName, handle) => ({type, fileName, handle}));
export const UnloadFile = createAction('Data - Remove file');
export const ErrorLoading = createAction('Data - Error Loading File', (fileName, error) => ({fileName, error}));