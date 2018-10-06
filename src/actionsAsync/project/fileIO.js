import { Parser } from 'jacquard-yarnparser';

import * as Actions from '../../actions/project/save';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

function writeSettingsFile(path, settings) {
  
}

function writeNodes(path, sections) {
  //TODO: blow away subdirectories

  sections.forEach(element => {
    
  });
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
    writeNodes(path, data.sections);

  } catch (err) {
    console.error(err);
    Actions.Error([err]);
  }
}

export function Read(path) {
}
