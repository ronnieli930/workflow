import { Logging }from '../helpers.js';
import counterPlusOne from './counterPlusOne.js';
import toggleCheckbox from './toggleCheckbox.js';

const habitFnMap = {
  wakeUpEarly: { fn: () => toggleCheckbox('Wakeup early') },
  sleepEarly: { fn: () => toggleCheckbox('Sleep early') },
  fasting: { fn: () => toggleCheckbox('Fasting') },
  stretches: { fn: () => toggleCheckbox('Stretches') },
  coldShower: { fn: () => toggleCheckbox('Cold shower') },
  skinCare: { fn: () => toggleCheckbox('Skin care') },
  touchFace: { fn: () => counterPlusOne('Touch face') },
  nut: { fn: () => counterPlusOne('Nut') },
  __aliases: {
    we: 'wakeUpEarly',
    se: 'sleepEarly',
    fa: 'fasting',
    st: 'stretches',
    cs: 'coldShower',
    sc: 'skinCare',
    tf: 'touchFace',
  },
};

(() => {
  const args = process.argv
  if (process.argv.length <= 2) {
    Logging.error('Wrong Args Number -_-||')
    return
  }
  const scriptName = args[2];
  if (scriptName === '__aliases') {
    Logging.error('Wtf man???')
  }

  const {__aliases: aliases} = habitFnMap;
  const cmd = habitFnMap[scriptName] || habitFnMap[aliases[scriptName]];
  if (!cmd) {
    Logging.error('Habit name does not exist!')
  }
  cmd?.fn()
})();
