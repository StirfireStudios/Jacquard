The [Jacquard Wiki](https://github.com/StirfireStudios/Jacquard/wiki) contains information relating to the entire project.

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
From the `frontend` directory, type `dev-start` on mac/linux and `dev-start-win` on windows. This will launch an instance of the Electron application.

If you make modifications to the source files and wish to see your changes in the Electron application without stopping and starting it, simply refresh the content within the app using `ctrl-r`/`command-r` depending on your platform of choice.

### Packaging
Depending on the platform you want to build for, you can use the relevant Yarn script (the build tool, not the dialog engine!) to produce a platform-specific binary:
```
yarn prd-pack
yarn prd-pack-win32
yarn prd-pack-win64
yarn prd-pack-mac
yarn prd-pack-linux
```

The resultant binaries are placed into the `/frontend/dist/` directory.