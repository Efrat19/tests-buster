#! /usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
console.dir(process.cwd());
console.log(help());


function help(){
    return `
    
Usage:  tests-buster bust [OPTIONS] [PATH]

A cli tool for broken tests cleaning

Options:
  -r, --root               The project root directory - where your package.json is. Defaults to current location.
  -p, --pattern            The test files search pattern. Accepts a js regex, defaults to /.spec.js$/
  -d, --dry                Scan the files without changing them. Run it before the actual slaughter to see how many tests can be busted
  -v, --version            Print version information and quit.
      --help               Display usage and quit.

Path: the tests root directory, relative to the project root. Defaults to current location. 
    `;
}