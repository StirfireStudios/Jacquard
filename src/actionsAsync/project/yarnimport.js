import { Parser } from 'jacquard-yarnparser';

import * as Actions from '../../actions/project/import';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

function getTextFrom(lines, startLine, endLine) {
  const outData = [];
  for(var index = startLine; index <= endLine; index++) outData.push(lines[index]);
  return outData.join("\n");
}

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

      const dataLines = data.split(/\r\n|\n/);
      
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
        let section = "default";
        if (node.attributes.sections != null) section = node.attributes.sections;
        if (dataObj.sections[section] == null) dataObj.sections[section] = {};
        const nodeData = {};
        nodeData.dirty = false;
        nodeData.parsedData = node;
        nodeData.text = getTextFrom(dataLines, node.location.start.line - 1, node.location.end.line - 1);
        dataObj.sections[section][nodeName] = nodeData;
        node.tags.forEach(tag => {
          dataObj.tags[tag].push({section: section, node: nodeName});
        });
      });

      Actions.LoadFinish(dataObj);

    });
  } catch(err) {
    Actions.LoadError(["err"]);
  }
}
