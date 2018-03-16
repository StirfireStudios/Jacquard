# Jacquard

Jacquard is a Yarn-based narrative tool!

## Overview
Jacquard consists of two main tools
* [Viewer - A tool for debugging Yarn files](viewer/README.md)
* [Front end - A tool for editing Yarn-based projects](frontend/README.md)

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

