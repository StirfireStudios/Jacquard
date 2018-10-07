import { Parser } from 'jacquard-yarnparser';

import * as Actions from '../../actions/project/import';

import * as Utils from './utils';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

export function Import(path) {
  Actions.LoadStart();
  try {
    fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
      if (err) {
        Actions.LoadError(err);
        return;
      }

      const parser = new Parser();
      if (parser.parse(data, false, path)) {
        Actions.LoadError(parser.errors);
        return;
      }            
      const dataObj = {
        parser: parser,
        characters: {},
        functions: {},
        settings: {},
        sections: {},
        tags: {},
        variables: {},
      }

      const nodeNames = parser.nodeNames;
      if (nodeNames.length == 0) {
        Actions.LoadError(["No nodes in yarn file!"]);
        return;
      }

      dataObj.settings.startNodes = [nodeNames[0]];    

      parser.nodeTags.forEach(tag => {
        dataObj.tags[tag] = [];
      });

      parser.functionNames.forEach(name => {
        dataObj.functions[name] = [];
      });

      parser.variableNames.forEach(name => {
        dataObj.variables[name] = [];
      });

      nodeNames.forEach(nodeName => {
        const node = parser.nodeNamed(nodeName);
        const nodeData = Utils.ParseNodeData(node, data);
        if (dataObj.sections[nodeData.section] == null) dataObj.sections[nodeData.section] = {};
        dataObj.sections[nodeData.section][nodeData.title] = nodeData;
        nodeData.tags.forEach(tag => {
          dataObj.tags[tag].push({section: nodeData.section, node: nodeData.title});
        });
      });

      Actions.LoadFinish(dataObj);

    });
  } catch(err) {
    Actions.LoadError(["err"]);
  }
}
