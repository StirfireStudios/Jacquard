import { createAction } from 'redux-act';

export const ChangeVisibility = createAction('View - change visibility', (key, show) => ({key, show}));