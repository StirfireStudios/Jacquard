# Jacquard Documentation

This document is work-in-progress, and will be for some time.

##### Writing in Yarn

Jacquard uses the [Yarn](https://github.com/thesecretlab/YarnSpinner/blob/development/Documentation/YarnSpinner-Dialogue/Yarn-Syntax.md) language. It's quite similar to Twine, but is designed to be integrated straight into a game engine. 

Content in Yarn is split into nodes, which contain text content (dialogue, etc), logic, and functions. For more information, including comprehensive tutorials, see the [YarnSpinner documentation](https://github.com/thesecretlab/YarnSpinner/tree/development/Documentation/YarnSpinner-Dialogue).

### Using Jacquard

#### Home

##### Opening, Saving, and Closing Projects

Jacquard supports importing and exporting .yarn.txt and JSON files, but defaults to JSON output (and uses JSON for its own project format).

To open a project, select _Open Existing Project_ (if it is a JSON file or Jacquard project), or _Import Project From Yarn_ (if it is a .yarn.txt file).

#### Preview

The Preview pane allows users to compile and run their script. It includes a variety of debug outputs, focusing on assisting users to easily and quickly diagnose script errors.

![Jacquard debug log UI](https://i.imgur.com/HoLZqoy.jpg)

#### Visualization

The Visualization pane shows a diagram of nodes in the project, with arrows connecting them if links exist between the nodes. To move a node, left-click on it and drag it to the desired location.

![Jacquard visual node view UI](https://i.imgur.com/rHzoBoB.jpg])

#### Nodes

The Nodes pane shows a list of Yarn nodes, their attributes, and their validation status. Users can filter the list by title, body text, and tags.

![Jacquard node list UI](https://i.imgur.com/3Sy53bZ.jpg)

#### Characters

// Not implemented yet.

#### Functions

// Not implemented yet.

#### Variables

// Not implemented yet.


### Feeding Yarn To Your Game Engine Like Very Dry Spaghetti

For now, use [YarnSpinner](https://github.com/thesecretlab/YarnSpinner).