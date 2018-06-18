# Jacquard
###### *A Yarn authoring tool for narrative game development.*

Jacquard is a tool for authoring [Yarn](https://github.com/thesecretlab/YarnSpinner) documents, to be used in game engines like Unity and Unreal Engine. It's built to be a spiritual successor of sorts to [Twine](http://twinery.org), so if you've used that before, Jacquard should feel familiar. Yarn syntax is inspired by [SugarCube](http://www.motoslave.net/sugarcube/2/docs/markup.html), and a full reference can be found [here](https://github.com/thesecretlab/YarnSpinner/blob/master/Documentation/YarnSpinner-Dialogue/Yarn-Syntax.md).

**Features:**
- Node-based drag-and-drop editing
- Automatic syntax validation
- Localization and voiceover reference support
- Arbitrary text segment tagging

**Planned features:**
- Bytecode export
- Syntax highlighting

**Downloads:** To download the latest version of Jacquard, visit our [releases page](https://github.com/StirfireStudios/Jacquard/releases).

### Using Jacquard

Jacquard is designed to empower writers and narrative designers to get their interactive scripts into a game engine as quickly and as easily as possible. User documentation can be found **[here](Documentation/README.md)**. If you're looking for a way to parse Yarn files in Unity, we recommend [YarnSpinner](https://github.com/thesecretlab/YarnSpinner).

### Developing Jacquard

Jacquard was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app), and its version-specific documentation can be found **[here](Documentation/CreateReactApp.md)**.

We also have an ANTLR-based parser, called Jacquard-YarnParser, which is available **[here](https://github.com/StirfireStudios/Jacquard-YarnParser)**.