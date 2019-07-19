
import { version } from '../../package.json';
import Output from './Output';

export default class Guide {
  constructor() {
    this.output = new Output();
    this.version = version;
  }

  printHelp() {
    this.output.log(`
      Usage:  tests-buster [OPTIONS]
      
      A cli tool for broken tests cleaning
      
      Options:
        -p, --path               The project root directory - where your package.json is. Defaults to current location.
        -P, --pattern            The test files search pattern. Accepts a js regex, defaults to ".spec.js$"
        -d, --dry-run            Scan the files without changing them. Run it before the actual slaughter to see how many tests can be busted
        -a  --auto-remove        Automatically remove empty test files
        -v, --version            Print version information and quit.
            --help               Display usage and quit.
            `);
  }

  printVersion() {
    this.output.log(`${this.version}\n`);
  }
}
