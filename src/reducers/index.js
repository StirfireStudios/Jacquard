import exportBytecode from './export/bytecode';
import menuData from './ui/menu';
import nodesData from './ui/nodes';
import previewSourceData from './preview/sourceData';
import previewState from './preview/state';
import previewView from './preview/view';
import projectData from './project/data';

export default function(state, action) {
  if (state == null) state = { Preview: {}, Export: {}, UI: {}, }
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
    UI: {
      Menu: menuData(state.UI.Menu, action),
      Nodes: nodesData(state.UI.Nodes, action),
    }
  }
}
