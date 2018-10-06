import exportBytecode from './export/bytecode';
import previewSourceData from './preview/sourceData';
import previewState from './preview/state';
import previewView from './preview/view';
import projectData from './project/data';

export default function(state, action) {
  if (state == null) state = { Preview: {}, Export: {} }
  return {
    Export: {
      Bytecode: exportBytecode(state.Export.Bytecode, action),
    },
    Preview: {
      SourceData: previewSourceData(state.Preview.SourceData, action),
      State: previewState(state.Preview.State, action),
      View: previewView(state.Preview.View, action),
    },
    Project: projectData(state.Project, action),
  }
}
