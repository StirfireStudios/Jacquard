#!/usr/bin/env bash

# The main function of the script.
main() {
  # Create the frontend using create-react-app
  node ./node_modules/create-react-app frontend
}

# Call the main function with the arguments passed to the script.
main "$@"