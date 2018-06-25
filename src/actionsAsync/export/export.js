import { Parser } from 'jacquard-yarnparser';
import { Compiler } from 'jacquard-yarncompiler';
import { FileIO } from 'jacquard-runtime';

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
  if (options.prefix.length == 0) options.prefix = "output";
  // lock bytecode input

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
      console.error("Errors compiling");
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
      .then((buffers) => {
        console.log("done");
      })
      .catch((err) => {
        console.error(err);
      });
    } catch (err) {
      console.error(err);
      return;
    }    

  }, 0);
}
