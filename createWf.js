import { insertScriptFn } from './helpers.js';

(() => {
  if (process.argv.length < 4 || process.argv.length > 5) {
    console.error('Wrong Args Number -_-||')
    return
  }
  const [k,v,f] = process.argv.slice(2)
  const forceFlag = f ? f==='-f' : false

  insertScriptFn({key: k , value: v , force: forceFlag})
})();
