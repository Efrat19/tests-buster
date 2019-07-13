
import { version } from '../package.json';

export default class Guide {
  constructor() {
    this.version = version;
  }

  //   printPathError() {
  //     console.log(`
  //     required parameter PATH is omitted or illegal.`);
  //     this.printHelp();
  //   }

  printHelp() {
    console.log(`
      Usage:  tests-buster bust [OPTIONS]
      
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
    console.log(`${this.version}`);
  }

  getFlags(args) {
    return {
      help: args.help,
      version: args.version || args.v,
      path: args.path || args.p,
      filePattern: args.pattern || args.P,
      isDry: args['dry-run'] || args.d,
      autoRemove: args['auto-remove'] || args.a,
    };
  }
}
