const {insertScriptFn} = require('./helpers.js');
const {scripts} = require('./package.json');

(() => {
  if (process.argv.length < 4) {
    console.error('Wrong Args Number -_-||')
    return
  }

  const [k,v, _] = process.argv.slice(2)
  const newCmd = [scripts[k], v].filter(Boolean).join('; ')

  insertScriptFn({key: k , value: newCmd , force: true})
})();
