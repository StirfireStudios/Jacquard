The [Jacquard Wiki](https://github.com/StirfireStudios/Jacquard/wiki) contains information relating to the entire project.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Take a look  [here](CreateReactAppREADME.md) for that documentation.

## Table of Contents
- [Available Scripts](#available-scripts)
  - [test](#test)
  - [lint](#lint)
  - [eject](#eject)
  - [dev-start](#dev-start)
  - [Packaging](#packaging)


## Available Scripts

In the project directory, you can run these commands using `npm` or `yarn` although `yarn` is preferred do to the performance benefits:

### `test`

Currently this project has no tests. They will be added at a future date.

Launches the test runner in the interactive watch mode.<br>

### `lint`

Runs the linter

### `eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `dev-start`
From the `frontend` directory, type `start-dev`. This will launch an instance of the Electron application.

If you make modifications to the source files and wish to see your changes in the Electron application without stopping and starting it, simply refresh the content within the app using `ctrl-r`/`command-r` depending on your platform of choice.

### Packaging

To build install files execute `yarn build` - by default this will build for your current OS.
Right now cross-platform builds are not supported.

The resultant binaries are placed into the `/dist/` directory.
