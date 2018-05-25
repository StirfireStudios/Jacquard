import { createReducer } from 'redux-act';
import * as JacquardRuntime from 'jacquard-runtime'

import * as DataActions from '../../actions/preview/sourceData';
import * as RuntimeActions from '../../actions/preview/runtime';

import handleShowText from './handlers/showText';
import handleCommand from './handlers/command';
import handleOptions from './handlers/options';
import handleNodeChange from './handlers/nodeChange';
import handleVariable from './handlers/variable';

const runtime = new JacquardRuntime.Runtime();

export function getRuntime() {
  return runtime;
}

function convertType(textType) {
  if (textType === 'logic') return JacquardRuntime.FileIO.Types.Logic;
  if (textType === 'dialogue') return JacquardRuntime.FileIO.Types.Dialogue;
  if (textType === 'sourceMap') return JacquardRuntime.FileIO.Types.SourceMap;

  return JacquardRuntime.FileIO.Types.Unknown;
}

function updateWithRuntimeData(state, runMode) {
  if (!runtime.ready) {
    return {
      ...state,
      ready: false,
      runMode: null,
      options: null,
      characters: [],
      variables: [],
      functions: [],
      nodeNames: [],
      halted: false,
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
      switch(message.constructor.name) {
        case "NodeChange":
          handleNodeChange(newState.text, message);
          break;
        case "Show":
          handleShowText(newState.text, message);
          break;
        case "Command":
          handleCommand(newState.text, message);
          keepRunning = keepRunning && newState.runState !== "toCommand";
          break;
        case "Options":
          handleOptions(newState, message, runtime);
          keepRunning = false;
          break;
        case "EndOfFile":
          keepRunning = false;
        case "Save":
        case "Load":
          handleVariable(newState.text, message);
          break;  
        case "Halt": 
          console.log("HALTED");
          newState.text.push({halted: true});
          newState.halted = true;
          keepRunning = false;
          break;
        default:
          console.log("Got message:");
          console.log(message.constructor.name);
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
    runtime.loadFile(handle);
    return { ...state, ready: runtime.ready};
  },
  [DataActions.Updated]: (state) => {
    runtime.reset();
    return updateWithRuntimeData();
  },
  [RuntimeActions.Deactivate]: (state) => ({
	  ...state,
  }),
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
}, {
  ready: false,
  runMode: null,
  options: null,
  characters: [],
  variables: [],
  functions: [],
  nodeNames: [],
  halted: false,
  text: [],
});
