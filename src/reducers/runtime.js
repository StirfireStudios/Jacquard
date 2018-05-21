import { createReducer } from 'redux-act';
import * as JacquardRuntime from 'jacquard-runtime'

import * as DataActions from '../actions/data';
import * as RuntimeActions from '../actions/runtime';

import handleShowText from './runtimeHandlers/showText';
import handleCommand from './runtimeHandlers/command';
import handleOptions from './runtimeHandlers/options';
import handleNodeChange from './runtimeHandlers/nodeChange';
import handleVariable from './runtimeHandlers/variable';

const runtime = new JacquardRuntime.Runtime();

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
      characters: [],
      variables: [],
      variableState: {},
      functions: [],
      nodeNames: [],
      nodeHistory: [],
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
    debugger;
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
  [RuntimeActions.Activate]: (state) => ({
	  ...state,
	  active: state.ready,
	}),
  [RuntimeActions.Deactivate]: (state) => ({
	  ...state,
	  active: false,
	}),
  [DataActions.LoadComplete]: (state, data) => {
    runtime.loadFile(data.handle);
    return updateWithRuntimeData(state);
  },
  [DataActions.UnloadFile]: (state, type) => {
    runtime.removeFile(convertType(type));
    return updateWithRuntimeData(state);
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
}, {
  ready: false,
  active: false,
  runMode: null,
  options: null,
  characters: [],
  variables: [],
  functions: [],
  nodeNames: [],
  halted: false,
});