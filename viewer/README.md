# Jacquard Viewer

## Dependencies

Jacquard Viewer requires the following dependencies be pre-installed:

* NodeJS (https://nodejs.org).
* Yarn package manager (https://yarnpkg.com).
* Wine (for building Windows binaries on OSX/Linux)

First, you need to make sure that you have nodeJs and Yarn installed (see the dependencies section above and install the relevant version for your platform).

Currenlty we're using `node v8.9.4` and `yarn v1.5.1`.

## Getting the additional files you need.
From the Viewer directory, do a `yarn install`. This will download all the necessary libraries you need, including Electron and the Electron Packager.

## Running during development
From the `viewer` directory, type `yarn start-local`. This will launch an instance of the application using Electron. 

Note that we are NOT using Webpack for this part of the project, as the goal is to merge it into the main Jacquard frontend application. This means that your changes do not automatically show up in the Electon application.

If you make modifications to the source files and wish to see your changes in the Electron application without stopping and starting it, simply refresh the content within the app using `ctrl-r`/`command-r` depending on your platform of choice.

## Building
Depending on the platform you want to build for, you can use the relevant Yarn script (the build tool, not the dialog engine!) to produce a platform-specific binary:
```
yarn package-mac
yarn package-win
yarn package-linux
```

The resultant binaries are placed into the `/viewer/dist/` directory.