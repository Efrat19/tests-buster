#! /usr/bin/env node
import minimist from 'minimist';
import Buster from './Buster';
import Guide from './Guide';

const argv = minimist(process.argv.slice(2));

const guide = new Guide();
const flags = guide.getFlags(argv);
if (flags.help) {
  guide.printHelp();
  process.exit(0);
}
if (flags.version) {
  guide.printVersion();
  process.exit(0);
}
(async () => {
  const buster = new Buster(flags);
  const code = await buster.start();
  // process.exit(code);
})();
