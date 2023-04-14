import readline from 'readline';
import { insertScriptFn, useCrayon, require } from './helpers.js';
const { scripts } = require('./package.json');

(async() => {
  const args = process.argv.slice(2)
  
  if (!args.length) {
    console.error('Nothing to merge -_-||')
    return
  }
  
  const { red, yellow, underscore } = useCrayon();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
  breakpoint: try {
    const d = new Date()
    const nameFlagIndex = args.indexOf('-n')

    const mergedCmd = nameFlagIndex < 0 ?
                        args.map(arg => scripts[arg])
                            .filter(Boolean)
                            .join('; ') : 
                        args.slice(0, nameFlagIndex)
                            .map(arg => scripts[arg])
                            .filter(Boolean)
                            .join('; ')
    
    const invalidCmds = nameFlagIndex < 0 ?
                        args.filter(a => !scripts[a]) :
                        args.slice(0, nameFlagIndex).filter(a => !scripts[a])
    if (invalidCmds.length && mergedCmd.length) {
      console.log(`Workflow ${red(underscore(invalidCmds.join(', ')))} do not exist! @_@`)
      const isContinue = await prompt(`Wanna continue merge workflow: ${yellow(underscore(mergedCmd))}?\n('N' or 'n' to break, else continue)\n`) || 'y'
      if (isContinue === 'n' || isContinue === 'N') {
        break breakpoint;
      }
    }
    const name = nameFlagIndex < 0 ?
                (await prompt("Please name the new workflow: ") || `wf${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`) : 
                args[nameFlagIndex+1];
    let forceFlag = false
    if (scripts[name]) {
      const inputKey = await prompt(`${yellow(underscore(name))} already exists. Overwrite?\n'Y' or 'y' to overwrite, else cancel\n`)
      forceFlag = inputKey === 'y' || inputKey === 'Y'
    }
    insertScriptFn({key: name , value: mergedCmd , force: forceFlag})
  } catch (e) {
    console.error("Sth wrong:\n", e && e.message);
  } finally {
    rl.close();
  }
})();
