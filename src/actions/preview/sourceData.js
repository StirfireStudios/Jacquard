import { createAction } from 'redux-act';

export const Compiling = createAction('Preview - Compiling to bytecode');
export const Compiled = createAction('Preview - Compile successful!');
export const CompileErrors = createAction('Preview - Compile error');
export const Updated = createAction('Preview - Source is updated so not validated');
