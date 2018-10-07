import { Parser } from 'jacquard-yarnparser';
import YAML from 'yaml'

import * as LoadActions from '../../actions/project/load';
import * as SaveActions from '../../actions/project/save';

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
    writeNodes(sectionPath, sections[sectionNames]);
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
    const node = nodes[nodeName];
    const path = sectionPath + Path.sep + nodeName + ".yarn.txt";
    fs.writeFileSync(path, node.text, {encoding: 'utf-8'});
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
      data.sections[entry] = loadSection(entryPath, data.parser);
      return;
    }
  });
}

function loadSection(sectionPath, parser) {
  const entries = fs.readdirSync(sectionPath, {withFileTypes: true});
  const sectionObj = {};
  entries.forEach(entry => {
    if (!entry.endsWith(".yarn.txt")) return;
    const entryPath = sectionPath + Path.sep + entry;
    const entryNodeName = entry.substr(0, entry.length - 9);
    sectionObj[entryNodeName] = {dirty: false};
    const text = fs.readFileSync(entryPath, {encoding: 'utf-8'});
    sectionObj[entryNodeName].text = text;
    parser.parse(text, false, entryPath); 
    sectionObj[entryNodeName].parsedData = parser.nodeNamed(entryNodeName);
  });

  return sectionObj;
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
    //TODO add settings here...
    dataObj.parser = new Parser();
    loadSections(path, dataObj);

    dataObj.parser.functionNames.forEach(name => {
      dataObj.functions[name] = [];
    });

    dataObj.parser.variableNames.forEach(name => {
      dataObj.variables[name] = [];
    });

    LoadActions.Complete(path, dataObj);
  } catch (err) {
    console.error(err);
    LoadActions.Error([err]);
  }

}
