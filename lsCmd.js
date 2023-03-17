const { useCrayon } = require('./helpers');
const {scripts} = require('./package.json');

(() => {
  const {red, green, yellow, underscore} = useCrayon()
  if (process.argv.length === 2) {
    console.log(scripts)
    return
  }
  // TODO
  // -n names only, don't show detail cmds
  const keys = process.argv.slice(2)
  keys.forEach(k => {
    if (!scripts[k]) {
      console.log(`${red(k)} does not exist =_=||`)
      return
    }
    console.log(`${yellow(k)}: ${underscore(green(scripts[k]))}`)
  })
})();