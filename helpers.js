import fs from 'fs';
import readline from 'readline';
import { createRequire } from "module";
import * as readlinePromises from 'readline/promises'
const require = createRequire(import.meta.url);
const obj = require('./package.json')

// Color printing
function useCrayon() {
  const COLOR_CONSTANT = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    // font color
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",
    // bg color
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGray: "\x1b[100m",
  }
  return {
    underscore: (txt) => (`${COLOR_CONSTANT['Underscore']}${txt}${COLOR_CONSTANT['Reset']}`),
    red: (txt) => (`${COLOR_CONSTANT['FgRed']}${txt}${COLOR_CONSTANT['Reset']}`),
    green: (txt) => (`${COLOR_CONSTANT['FgGreen']}${txt}${COLOR_CONSTANT['Reset']}`),
    yellow: (txt) => (`${COLOR_CONSTANT['FgYellow']}${txt}${COLOR_CONSTANT['Reset']}`),
    blue: (txt) => (`${COLOR_CONSTANT['FgBlue']}${txt}${COLOR_CONSTANT['Reset']}`),
    magenta: (txt) => (`${COLOR_CONSTANT['FgMagenta']}${txt}${COLOR_CONSTANT['Reset']}`),
    cyan: (txt) => (`${COLOR_CONSTANT['FgCyan']}${txt}${COLOR_CONSTANT['Reset']}`),
    white: (txt) => (`${COLOR_CONSTANT['FgWhite']}${txt}${COLOR_CONSTANT['Reset']}`),
    gray: (txt) => (`${COLOR_CONSTANT['FgGray']}${txt}${COLOR_CONSTANT['Reset']}`),
    bgBlack: (txt) => (`${COLOR_CONSTANT['BgBlack']}${txt}${COLOR_CONSTANT['Reset']}`),
    bgRed: (txt) => (`${COLOR_CONSTANT['BgRed']}${txt}${COLOR_CONSTANT['Reset']}`),
    bgGreen: (txt) => (`${COLOR_CONSTANT['BgGreen']}${txt}${COLOR_CONSTANT['Reset']}`),
    bgYellow: (txt) => (`${COLOR_CONSTANT['BgYellow']}${txt}${COLOR_CONSTANT['Reset']}`),
    bgBlue: (txt) => (`${COLOR_CONSTANT['BgBlue']}${txt}${COLOR_CONSTANT['Reset']}`),
    bgMagenta: (txt) => (`${COLOR_CONSTANT['BgMagenta']}${txt}${COLOR_CONSTANT['Reset']}`),
    bgCyan: (txt) => (`${COLOR_CONSTANT['BgCyan']}${txt}${COLOR_CONSTANT['Reset']}`),
    bgWhite: (txt) => (`${COLOR_CONSTANT['BgWhite']}${txt}${COLOR_CONSTANT['Reset']}`),
    bgGray: (txt) => (`${COLOR_CONSTANT['BgGray']}${txt}${COLOR_CONSTANT['Reset']}`),
  }
}

function writeToPackageJson(newObj, callback) {
  const json = JSON.stringify(newObj, null, 2)+'\n';
  fs.writeFile('package.json', json, 'utf8', callback);
}

function insertScriptFn({
  key,
  value,
  force=false
}) {
  try {
    const newObj = {...obj}
    if (!force && newObj['scripts'][key]) {
      console.log('Yo this workflow already exists!\nTry rename it or overwrite with -f')
      return
    }
    newObj['scripts'][key] = value
    writeToPackageJson(newObj, () => {
      const { green, yellow, underscore } = useCrayon()
      console.log(`Workflow ${yellow(underscore(key))} added successfully!\n\nCmd details:\n${green(underscore(value))}`)
    })
  } catch (error) {
    console.log("insertScriptFn Error: ", e)
  }
}

async function removeScriptFn(...keys) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
  try {
    const uniqKeys = [...new Set(keys)]
    const newObj = {...obj}
    const deletedEntries = []
    uniqKeys.forEach(k => {
      if (newObj['scripts'][k]) {
        const value = newObj['scripts'][k]
        delete newObj['scripts'][k]
        deletedEntries.push({key: k, value})
      } else {
      const { red, underscore } = useCrayon()
      console.log(`Workflow ${red(underscore(k))} does not exist! =_=||`)
      }
    })
    if (deletedEntries.length) {
      const { yellow, green, red, underscore } = useCrayon()
      const userInput = await prompt(`Are you sure you want to delete ${red(underscore(uniqKeys.join(', ')))}?\n'Y' or 'y' to continue\n`)
      if (userInput === 'y' || userInput === 'Y') {
        writeToPackageJson(newObj, () => {
          console.log(`Workflow ${yellow(underscore(deletedEntries.map(e => e.key).join(', ')))} removed successfully!\n`)
          console.log(`Cmd details:\n${green(underscore(deletedEntries.map(e => e.value).join('\n')))}`)
        })
      } else {
        console.log('Cancelled')
      }
    }
  } catch (e) {
    console.log("removeScriptFn Error: ", e)
  } finally {
    rl.close()
  }
}

// TODO: FLAG READER
function flagReader(args) {
  console.log('read Flag')
  // link to lsCmd names only!
}

const Logging = {
  error: (str) => {console.log(`${useCrayon().red(str)}`)},
  success: (str) => {console.log(`${useCrayon().green(str)}`)},
  warn: (str) => {console.log(`${useCrayon().yellow(str)}`)},
  info: (str) => {console.log(str)},
}

function getCurrentDate(gap) {
  // gap is the timezone difference.
  const now = new Date();
  const fiveHoursInMilliseconds = gap * 60 * 60 * 1000;
  const timeMinusFiveHours = new Date(now.getTime() + fiveHoursInMilliseconds);
  return timeMinusFiveHours;
}


function getCurrentDateWithTimezone(createTime="07:00:00") {
  const now = getCurrentDate(+5);
  /**
   * Any entry before 3:00 a.m. HKT,
   * will be consider within the same day,
   * instead of count as a new day.
   */
  const timezoneOffsetMinutes = now.getTimezoneOffset();
  const timezoneOffsetSign = timezoneOffsetMinutes > 0 ? '-' : '+';
  const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffsetMinutes / 60));
  const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes % 60);

  const timezoneOffsetString = `${timezoneOffsetSign}${String(timezoneOffsetHours).padStart(2, '0')}:${String(timezoneOffsetMinutesRemainder).padStart(2, '0')}`;

  const isoStringPartial = now.toISOString()?.slice(0,11);

  return `${isoStringPartial}${createTime}${timezoneOffsetString}`;
}

const getInputMultilines = async(prompt="User input:") => {
  const { cyan } = useCrayon()
  const rl = readlinePromises.createInterface({input: process.stdin, output: process.stdout})
  const linesArr = [];
  let temp = await rl.question(cyan(`${prompt}\n`) + "> ");
  do {
    if (!temp) {
      break;
    }
    linesArr.push(temp);
    temp = await rl.question('> ');
  } while (temp);
  rl.close();
  const res = linesArr.join('\n')

  if (!res) {
    Logging.error("Nothing to add, bye.")
    process.exit(0)
  }
  return res;
}

export {
  insertScriptFn,
  removeScriptFn,
  useCrayon,
  require,
  Logging,
  getCurrentDateWithTimezone,
  getInputMultilines,
}

// insertScriptFn({key:'xxx', value:'abc'})
// insertScriptFn({key:'yyy', value:'def'})
// removeScriptFn('xxx', 'yyy')
