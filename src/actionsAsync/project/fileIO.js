import { Parser } from 'jacquard-yarnparser';
import YAML from 'yaml'

import * as LoadActions from '../../actions/project/load';
import * as SaveActions from '../../actions/project/save';

import * as Utils from './utils';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const Path = electron.remote.require('path');

function removePath(path, stat) {
  if (stat == null) stat = fs.statSync(path);

  if (stat.isDirectory()) {
    fs.readdirSync(path).forEach(entry => {
      removePath(path + Path.sep + entry);
    });
    fs.rmdirSync(path);
  } else {
    fs.unlinkSync(path);
  }
}

function writeSettingsFile(projectPath, settings) {
  const path = projectPath + Path.sep + "settings.yml";
  const sortedOutput = {};
  const keys = Object.keys(settings);
  keys.sort();
  keys.forEach(key => {
    sortedOutput[key] = settings[key];
  });
  fs.writeFileSync(path, YAML.stringify(sortedOutput), {encoding: 'utf-8'});
}

function writeSections(projectPath, sections) {
  const path = projectPath + Path.sep + "sections";
 
  const sectionNames = Object.keys(sections);

  if (fs.existsSync(path)) {
    const stat = fs.statSync(path);
    if (!stat.isDirectory()) throw new Error("Sections exists and isn't a directory"); 
  } else {
    fs.mkdirSync(path);
  }

  fs.readdirSync(path).forEach(entry => {
    const entryPath = path + Path.sep + entry
    const stat = fs.statSync(entryPath);

    if (!stat.isDirectory()) {
      removePath(entryPath, stat);
      return;
    }

    if (sectionNames.indexOf(entry) == -1) {
      removePath(entryPath, stat);
      return;
    }
  });

  sectionNames.forEach(sectionName => {
    const sectionPath = path + Path.sep + sectionName;
    if (!fs.existsSync(sectionPath)) fs.mkdirSync(sectionPath);
    writeNodes(sectionPath, sections[sectionName]);
  });
}

function writeNodes(sectionPath, nodes) {
  const nodeNames = Object.keys(nodes);

  const entries = fs.readdirSync(sectionPath, {withFileTypes: true});
  entries.forEach(entry => {
    const entryPath = sectionPath + Path.sep + entry;
    const entryStat = fs.statSync(entryPath);
    if (!entryStat.isFile() || !entry.endsWith(".yarn.txt")) {
      removePath(entryPath, entryStat);
      return;
    }

    const entryNodeName = entry.substr(0, entry.length - 9);

    if (nodeNames.indexOf(entryNodeName) == -1) {
      fs.unlinkSync(entryPath); 
      return;
    }
  });

  nodeNames.forEach(nodeName => {
    //TODO Handle dirty nodes!

    const node = nodes[nodeName];
    const path = sectionPath + Path.sep + nodeName + ".yarn.txt";
    let yarnData = null;
    if (node.section === "default") {
      yarnData = `title: ${node.title}\n`;
    } else {
      yarnData = `title: ${node.section}-${node.title}\n`;
    }

    if (node.parsedData.tags.length > 0) {
      yarnData += `tags: ${node.parsedData.tags.join(", ")}\n`;   
    }

    yarnData += `section: ${node.section}\n`;

    Object.keys(node.attributes).forEach(attrName => {
      yarnData += `${attrName}: ${node.attributes[attrName]}\n`;
    })
    yarnData += `---\n${node.body}\n===`;
    fs.writeFileSync(path, yarnData, {encoding: 'utf-8'});
  })
}

export function Write(path, data) {
  SaveActions.Start();
  try {
    if (fs.existsSync(path)) {
      const stat = fs.statSync(path);
      if (!stat.isDirectory()) {
        SaveActions.Error(["Exists and is not a directory!"]);
        return;
      }
    } else {
      fs.mkdirSync(path);
    }

    writeSettingsFile(path, data.settings);
    writeSections(path, data.sections);
    SaveActions.Complete(path);
  } catch (err) {
    console.error(err);
    SaveActions.Error([err]);
  }
}

function loadSettings(projectPath, data) {
  const path = projectPath + Path.sep + "settings.yml";
  if (!fs.existsSync(path)) {
    throw new Error("No settings file - project path isn't a valid jacquard project");
  }

  const stat = fs.statSync(path);
  if (!stat.isFile()) {
    throw new Error("Settings file isn't a file - project path isn't a valid jacquard project");
  }

  const settingsData = fs.readFileSync(path, {encoding: 'utf-8'});
  data.settings = YAML.parse(settingsData);
}

function loadSections(projectPath, data) {
  const path = projectPath + Path.sep + "sections"; 
  if (!fs.existsSync(path)) {
    throw new Error("No sections directory - project path isn't a valid jacquard project");
  }

  const stat = fs.statSync(path);
  if (!stat.isDirectory()) {
    throw new Error("Sections isn't a directory - project path isn't a valid jacquard project");
  }  

  const entries = fs.readdirSync(path, {withFileTypes: true});
  entries.forEach(entry => {
    const entryPath = path + Path.sep + entry;
    const entryStat = fs.statSync(entryPath);
    if (entryStat.isDirectory()) {
      loadSection(entryPath, entry, data.sections, data.parser);
      return;
    }
  });
}

function loadSection(sectionPath, sectionName, sections, parser) {
  const entries = fs.readdirSync(sectionPath, {withFileTypes: true});

  entries.forEach(entry => {
    if (!entry.endsWith(".yarn.txt")) return;
    const entryPath = sectionPath + Path.sep + entry;
    const text = fs.readFileSync(entryPath, {encoding: 'utf-8'});
    parser.parse(text, false, entryPath);
    parser.lastNodesParsed.forEach(nodeName => {
      const parsedNode = parser.nodeNamed(nodeName);
      const nodeData = Utils.ParseNodeData(parsedNode, text, sectionName);
      if (sections[nodeData.section] == null) sections[nodeData.section] = {};
      sections[nodeData.section][nodeData.title] = nodeData;
    });
  });
}

export function Read(path) {
  LoadActions.Start();
  try {
    if (!fs.existsSync(path)) {
      LoadActions.Error([`${path} doesn't exist`]);
      return;
    }

    const stat = fs.statSync(path);
    if (!stat.isDirectory()) {
      LoadActions.Error([`${path} isn't a directory`]);
      return;
    }

    const dataObj = {
      characters: {},
      functions: {},
      sections: {},
      tags: {},
      variables: {},
    }

    loadSettings(path, dataObj);
    dataObj.parser = new Parser();
    loadSections(path, dataObj);
    
    dataObj.functions = dataObj.parser.functionNames;
    dataObj.functionMap = dataObj.parser.functionsNodeMap;

    dataObj.characters = dataObj.parser.characterNames;
    dataObj.characterMap = dataObj.parser.charactersNodeMap;

    dataObj.variables = dataObj.parser.variableNames;
    dataObj.variableMap = dataObj.parser.variablesNodeMap;

    LoadActions.Complete(path, dataObj);
  } catch (err) {
    console.error(err);
    LoadActions.Error([err]);
  }
}
