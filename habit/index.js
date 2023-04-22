import { Logging }from '../helpers.js';
import { attributeMap, getHabitFn, parseArg } from './helper.js';


(() => {
  const args = process.argv
  if (process.argv.length <= 2) {
    Logging.error('Wrong Args Number -_-||')
    return
  }
  const scriptName = args[2];
  const value = parseArg(args?.[3]);

  const fn = getHabitFn(scriptName);
  if (!fn) {
    Logging.error('Habit name does not exist!')
    process.exit(0)
  }

  const attr = attributeMap[scriptName]
  fn(attr, value)
})();
