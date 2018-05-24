const OS = require('os');
const Path = require('path');
const ChildProcess = require('child_process');

let command = null;
switch(OS.type()) {
  case "Darwin":
  case "Linux":
    command = `yarn concurrently "BROWSER=none react-app-rewired start" "wait-on http://localhost:3000 && yarn electron ."`
    break;
  case "Windows_NT":  
    command = `yarn concurrently "set BROWSER=none&& react-app-rewired start" "wait-on http://localhost:3000 && yarn electron ."`
    break;
}

const process = ChildProcess.exec(command);
process.stdout.on('data', (data) => {
  console.log(data.toString());
});
process.stderr.on('data', (data) => {
  console.error(data.toString());
});  
process.on('close', (code) => {
  compete = true;
});
process.on('error', (err) => {
  complete = true;
});
process.on('exit', (code, signal) => {
  complete = true;
});

const waitLoop = function() {
  if (!complete) setTimeout(waitLoop, 10);
}
