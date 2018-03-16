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

### Dependencies

Jacquard requires the following dependencies be pre-installed:

* NodeJS 8.x.x (https://nodejs.org).
* Yarn package manager (https://yarnpkg.com).

You should clone the repo to your local machine.

## Front End 
## Viewer

  1. Navigate to the `viewer/` directory where you cloned this repo
  2. install the dependencies via a `yarn`
  3. package it for your OS:
    * windows: `yarn package-win` 
    * macOS: `yarn package-mac`
	* linux: `yarn package-linux`
	
## Debugging
### Front End 
### Viewer

## Deploying
### Front End
### Viewer

