const OS = require('os');
const Path = require('path');
const ChildProcess = require('child_process');
const program = require('commander');

const Package = require('../package.json')

let platform = null;
let errors = [];

function getPlatformFromCurrent() {
  switch(OS.type()) {
    case "Darwin":
      return "macos";
    case "Windows_NT":
      return "win";
    case "Linux":
      return "linux";
  }
}

program
  .version(Package.version)
  .arguments('[platform]')
  .action(function(arg0) {
    platform = arg0;
  })
  .parse(process.argv);

if (platform != null) platform = platform.toLowerCase();

switch(platform) {
  case null:
    platform = getPlatformFromCurrent();
    break;
  case "macos":
    platform = "mac";
  case "mac":
  case "win":
  case "linux":
    break;
  default:
    platform = null;
}

if (platform === null) {
  errors.push("Unknown platform, please specify either 'win', 'macos' or 'linux'");
}

if (errors.length > 0) {
  for(let error of errors) console.error(error);
  program.help();
  process.exit(-1);
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log("Command: " + command);
    const process = ChildProcess.exec(command);
    process.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });  
    process.on('close', (code) => {
      if (code === 0) { resolve(); return }
      reject();
    });
    process.on('error', (err) => {
      console.error(err);
      reject();
    });
    process.on('exit', (code, signal) => {
      if (code === 0) { resolve(); return }
      reject();
    });
  });
}

function copyFiles() {
  const pathNames = [
    Path.join("assets", "icon.png"),
  ]

  const dst = `build${Path.sep}`;

  pathNames.forEach((path) => {
    switch(OS.type()) {
      case "Windows_NT":
        ChildProcess.execSync(`copy ${path} ${dst}`);
        break;
      case "Darwin":
      case "Linux":
        ChildProcess.execSync(`cp ${path} ${dst}`);
        break;   
    }
  });
}

let complete = false;

runCommand("yarn react-app-rewired build").then(() => {
  copyFiles();
  return runCommand(`yarn electron-builder --${platform} --x64`).then(() => {
    complete = true;
  })
}).catch((err) => {
  process.exit(-1);
  complete = true;
});

const waitLoop = function() {
  if (!complete) setTimeout(waitLoop, 10);
}
waitLoop();
