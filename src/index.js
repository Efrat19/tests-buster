#! /usr/bin/env node
// import minimist from 'minimist';
// import Buster from './Buster';
// import { version } from './package.json';

// const argv = minimist(process.argv.slice(2));

console.log(help());
// const buster = new Buster();
// buster.bust();

function help() {
  return `
    
Usage:  tests-buster bust [OPTIONS] PATH

A cli tool for broken tests cleaning

Options:
  -r, --root               The project root directory - where your package.json is. Defaults to current location.
  -p, --pattern            The test files search pattern. Accepts a js regex, defaults to /.spec.js$/
  -d, --dry                Scan the files without changing them. Run it before the actual slaughter to see how many tests can be busted
      --rm                 Delete empty test files
  -v, --version            Print version information and quit.
      --help               Display usage and quit.

Path: the tests root directory, relative to the project root. Defaults to current location. 
    `;
}
