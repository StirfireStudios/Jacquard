import { createReducer } from 'redux-act';
import { Messages, Runtime } from 'jacquard-runtime'

import * as DataActions from '../../actions/preview/sourceData';
import * as RuntimeActions from '../../actions/preview/runtime';

import handleShowText from './handlers/showText';
import handleCommand from './handlers/command';
import handleFunction from './handlers/function';
import handleOptions from './handlers/options';
import handleNodeChange from './handlers/nodeChange';
import handleVariable from './handlers/variable';

const runtime = new Runtime();

export function getRuntime() {
  return runtime;
}

function updateWithRuntimeData(state, runMode) {
  if (!runtime.ready) {
    return {
      ...state,
      ready: false,
      runMode: null,
      options: null,
      currentFunc: null,
      characters: [],
      variables: [],
      functions: [],
      nodeNames: [],
      halted: false,
      endOfFile: false,
      text: [],
    }
  }

  const newState = {
    ...state,
    runMode: runMode != null ? runMode : state.runMode,
    ready: true,
    options: state.options != null ? state.options.map((item) => (item)) : null,
    text: state.text.map((item) => (item)),
  };
   
  let keepRunning = newState.ready && newState.runMode != null;
  keepRunning = keepRunning && newState.options == null;
  while(keepRunning) {
    keepRunning = runMode !== "step";
    const message = runtime.run(runMode === "step");
    if (message != null) {
      switch(message.constructor) {
        case Messages.NodeChange:
          handleNodeChange(newState.text, message);
          break;
        case Messages.Text.Show:
          handleShowText(newState.text, message);
          break;
        case Messages.Command:
          handleCommand(newState.text, message);
          keepRunning = keepRunning && newState.runState !== "toCommand";
          break;
        case Messages.Options:
          handleOptions(newState, message, runtime);
          keepRunning = false;
          break;
        case Messages.EndOfFile:
          keepRunning = false;
          newState.endOfFile = true;
          break;
        case Messages.Variable.Save:
        case Messages.Variable.Load:
          handleVariable(newState.text, message);
          break;  
        case Messages.Halt: 
          newState.text.push({halted: true});
          newState.halted = true;
          keepRunning = false;
          break;
        case Messages.Function:
          if (handleFunction(newState, message)) keepRunning = false;
          break;
        default:
          console.log("Got message:");
          console.log(message.constructor.name);
          keepRunning = false;
          newState.halted = true;
          break;
      }
    }
  }

  newState.characters = runtime.characters;
  newState.variables = runtime.variableList;
  newState.variableState = runtime.variables;
  newState.functions = runtime.functionList;
  newState.dialogueLoaded = runtime.dialogueLoaded;
  newState.nodeNames = runtime.nodeNames;
  newState.nodeHistory = runtime.nodeHistory;

  return newState;
}

export default createReducer({
  [RuntimeActions.LoadFile]: (state, handle) => {
    const handles = Object.assign([], state.handles);
    handles.push(handle);
    runtime.loadFile(handle);
    return updateWithRuntimeData({
      ...state,
      handles: handles,
    })
  },
  [DataActions.Updated]: (state) => {
    runtime.reset();
    return updateWithRuntimeData({
      ...state,
      handles: [],
      halted: false,
      endOfFile: false,
    });
  },
  [RuntimeActions.Reset]: (state) => {
    runtime.reset();
    state.handles.forEach((handle) => { runtime.loadFile(handle) });
    return updateWithRuntimeData({
      ...state,
      runMode: null,
      halted: false,
      endOfFile: false,
      text: [], 
      options: null,
    });
  },
  [RuntimeActions.Run]: (state) => {
    return updateWithRuntimeData(state, "toOption");
  },
  [RuntimeActions.RunStep]: (state) => {
    return updateWithRuntimeData(state, "step");
  },
  [RuntimeActions.OptionSelect]: (state, option) => {
    state.options = null;
    state.text.push({optionSelected: option});
    runtime.moveInstructionPointerTo(option.data);
    return updateWithRuntimeData(state, state.runMode);
  },
  [RuntimeActions.MoveToNode]: (state, nodeName) => {
    if (runtime.moveInstructionPointerToNode(nodeName)) {
      state.options = null;
      state.text = [];
      return updateWithRuntimeData(state);  
    } else {
      return state;
    }
  },
  [RuntimeActions.FuncValue]: (state, value) => {
    state.currentFunc = null;
    runtime.functionReturnValue(value);
    return updateWithRuntimeData(state);
  }
}, {
  ready: false,
  runMode: null,
  currentFunc: null,
  options: null,
  characters: [],
  variables: [],
  functions: [],
  nodeNames: [],
  halted: false,
  endOfFile: false,
  handles: [],
  text: [],
});
