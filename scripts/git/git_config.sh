#!/usr/bin/env bash

# The main function of the script.
main() {
  # Get the Git user name parameter
  local -r param_git_user_name=$1

  # Get the Git user email address parameter
  local -r param_git_user_email_address=$2

  # Get the Git remote origin parameter, defaulting to git@github.com if empty
  local param_git_remote_origin=$3
  if [ -z "${param_git_remote_origin}" ]; then
    param_git_remote_origin="git@github.com"
  fi

  # Set the Git remote origin for SSH
  git remote add origin "${param_git_remote_origin}:StirfireStudios/Jacquard.git"

  # Set the Git user name and email address
  git config user.name "${param_git_user_name}"
  git config user.email "${param_git_user_email_address}"

  # Force LF only in text files.
  git config --local core.eol lf
  git config --local core.autcrlf true

  # Enable support for long paths on Windows.
  git config --local core.longpaths true

  # Create the README
  echo "# Jacquard" >> README.md

  # Add the README to Git
  git add README.md
  git commit -m "Added README"
  git push -u origin master
}

# Call the main function with the arguments passed to the script.
main "$@"