import { Parser } from 'jacquard-yarnparser';
import { Compiler } from 'jacquard-yarncompiler';
import { FileIO } from 'jacquard-runtime';

import * as Actions from '../../actions/preview/sourceData';
import * as RuntimeActions from '../../actions/preview/runtime';

import service from '../../services/yarnService';

export function Validate(project) {
  Actions.Compiling();
  // avoid Zalgo
  setTimeout(() => {
    const yarnString = service.exportProjectToYarn(project);
    const parser = new Parser();
    if (parser.parse(yarnString, false, "project.yarn.txt")) {
      Actions.CompileErrors(parser.errors);
      return;
    }

    const errors = [];
    parser.nodeNames.forEach((name) => {
      const node = parser.nodeNamed(name);
      const links = node.outgoingLinks;
      Object.keys(links).forEach((linkName) => {
        if (links[linkName] == null) {
          errors.push(`Node ${name} has a link to ${linkName} which doesn't exist!`);
        }
      })
    });

    if (errors.length > 0) {
      Actions.CompileErrors(errors);
      return;
    }

    try {
      const compiler = new Compiler();
      compiler.process(parser);
      compiler.assemble();
      compiler.writeBuffers(true, false)
      .then((buffers) => {
        Actions.Compiled();
        FileIO.Open(buffers.logic).then((handle) => {
          RuntimeActions.LoadFile(handle);
        });
        FileIO.Open(buffers.dialogue).then((handle) => {
          RuntimeActions.LoadFile(handle);
        })
      })
      .catch((err) => {
        console.error(err);
        Actions.CompileErrors([`Compile failed :( ${err.toString()}`])
      });
    } catch (err) {
      console.error(err);
      Actions.CompileErrors([`Compile failed :( ${err.toString()}`]);
      return;
    }

  }, 0);
}
