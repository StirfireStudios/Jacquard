import { Parser } from 'jacquard-yarnparser';
import { Compiler } from 'jacquard-yarncompiler';

import * as BytecodeActions from '../../actions/export/bytecode';

import service from '../../services/yarnService';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const Path = electron.remote.require('path');

function createOutputStream(path, prefix, extension, encoding) {
  const realPath = Path.join(path, `${prefix}.${extension}`);

  if (encoding == null) encoding = 'utf8';
	const options = {
		flags: 'w',
		encoding: encoding,
		autoClose: true
  }  
  return fs.createWriteStream(realPath, options);
}

export function Bytecode(path, project, options) {
  if (options.prefix.length === 0) options.prefix = "output";
  BytecodeActions.Exporting();

  // avoid Zalgo
  setTimeout(() => {
    const yarnString = service.exportProjectToYarn(project);
    const parser = new Parser(service.configFromProjectOptions(project.options));

    let errors = parser.parse(yarnString, false, "project.yarn.txt");
    if (!errors) {
      parser.nodeNames.forEach((name) => {
        const node = parser.nodeNamed(name);
        const links = node.outgoingLinks;
        Object.keys(links).forEach((linkName) => {
          if (links[linkName] == null)  errors = true;
        });
      });  
    }

    if (errors) {
      BytecodeActions.Error("Error with parsing - check Preview");
      return;
    }

    try {
      const logic = createOutputStream(path, options.prefix, "jqrdl", 'binary');
      const dialog = createOutputStream(path, options.prefix, "jqrdd", 'binary');
      const debug = options.debug ? createOutputStream(path, options.prefix, "debug", 'utf8') : null; 
      const sourceMap = options.sourceMap ? createOutputStream(path, options.prefix, "sourceMap", 'utf8') : null;

      const compiler = new Compiler();
      compiler.process(parser);
      compiler.assemble();

      compiler.writeBytecode(logic, dialog, sourceMap, debug)
      .then(() => {
        logic.close();
        dialog.close();
        if (debug != null) debug.close();
        if (sourceMap != null) sourceMap.close();
        BytecodeActions.Complete();
      })
      .catch((err) => {
        BytecodeActions.Error(err.toString());
      });
    } catch (err) {
      BytecodeActions.Error(err.toString());
      return;
    }    

  }, 0);
}
