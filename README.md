# Jacquard

Jacquard is a Yarn-based narrative tool!

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
