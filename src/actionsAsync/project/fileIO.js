import { Parser } from 'jacquard-yarnparser';
import YAML from 'yaml'

import * as Actions from '../../actions/project/save';


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
  Actions.Start();
  try {
    if (fs.existsSync(path)) {
      const stat = fs.statSync(path);
      if (!stat.isDirectory()) {
        Actions.Error(["Exists and is not a directory!"]);
        return;
      }
    } else {
      fs.mkdirSync(path);
    }

    writeSettingsFile(path, data.settings);
    writeSections(path, data.sections);
    Actions.Complete(path);
  } catch (err) {
    console.error(err);
    Actions.Error([err]);
  }
}

export function Read(path) {
}
