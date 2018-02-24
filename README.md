# Jacquard

Jacquard is a Yarn-based narrative tool!

## Overview
Jacquard consists of two main tools
* Viewer - A tool for debugging Yarn files
* Front end - A tool for editing Yarn-based projects

## Front End Development Notes
### TODO List
* Create generic selectable grids
	* Selectable items for navigation
* Create Modal form components
* Finish UI Mockup
* Define the data structure using in memory data
* Load the components dynamically
* Load data from files (requires electron)

### Important Design Notes
* Users want to be able to add items to function lists etc. quickly
* If possible, functions, variables and characters should be stored in a generic JSON format and dealt with in the UI in a generic manner.
* The primary UI flow centres around the Node list. Users will be adding and removing items from here. Grid needs to be sortable etc. and the nodes need to be easily findable.
* Adding/Editing a node is where the majority of the UI will come together. It centres around a text panel that you can insert templated text (e.g. characters, functions, other nodes etc.) into.


## Building

### Git Configuration

To configure Git, run the `./scripts/git/git_init.sh` script from the top-level project directory, passing in your username and email as the first and second parameters respectively. For example:

`./scripts/git/git_init.sh "Name" "name@email.com"`

If you need to specify a custom remote origin, you can pass one as the third parameter. For example:

`./scripts/git/git_init.sh "Name" "name@email.com" "git@my-custom-remote-origin"`

### Dependencies

Jacquard requires the following dependencies be pre-installed:

* NodeJS (https://nodejs.org).
* Yarn package manager (https://yarnpkg.com).

## Front End 
## Viewer

## Debugging
### Front End 
### Viewer

## Deploying
### Front End
### Viewer

