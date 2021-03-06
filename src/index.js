#! /usr/bin/env node
import minimist from 'minimist';
import Buster from './Buster';
import Guide from './output_utils/Guide';

const BUST = 'bust';
const args = minimist(process.argv.slice(2));
const guide = new Guide();
const flags = {
  command: args._[0],
  help: args.help,
  version: args.version || args.v,
  path: args.path || args.p,
  filePattern: args.pattern || args.P,
  isDry: args['dry-run'] || args.d,
  autoRemove: args['auto-remove'] || args.a,
};
if (flags.help) {
  guide.printHelp();
  process.exit(0);
}
if (flags.version) {
  guide.printVersion();
  process.exit(0);
}
if (flags.command === BUST) {
  const buster = new Buster(flags);
  buster.start();
} else {
  guide.unknownCommand(flags.command);
  process.exit(2);
}
