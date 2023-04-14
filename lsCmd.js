import { useCrayon, require } from './helpers.js';
const { scripts } = require('./package.json');

(() => {
  const {red, cyan, yellow, underscore} = useCrayon()
  const args = process.argv
  // TODO
  // -n names only, don't show detail cmds
  const keys = args.length > 2 ? process.argv.slice(2) : Object.keys(scripts)
  keys.forEach(k => {
    if (!scripts[k]) {
      console.log(`${red(k)} does not exist =_=||`)
      return
    }
    console.log(`${cyan(k)}: ${underscore(yellow(scripts[k]))}`)
  })
})();
