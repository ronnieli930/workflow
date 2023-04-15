import numberAddValue from './numberAddValue.js';
import toggleCheckbox from './toggleCheckbox.js';

const parseArg = (arg) => {
  if (arg === 'true') {
    return true;
  } else if (arg === 'false') {
    return false;
  } else if (!isNaN(arg)) {
    return Number(arg);
  } else {
    return arg;
  }
};

const cmdUseToggle = new Set([
  'wakeUpEarly', 'we',
  'sleepEarly', 'se',
  'fasting', 'fa',
  'stretches', 'st',
  'coldShower', 'cs',
  'skinCare', 'sc',
]);

const cmdUseNumber = new Set([
  'touchFace', 'tf',
  'nut',
  'sugar', 'su',
]);

const getHabitFn = (cmd) => {
  if (cmdUseToggle.has(cmd)) {
    return toggleCheckbox
  }
  if (cmdUseNumber.has(cmd)) {
    return numberAddValue
  }
  return null;
};

const attributeMap = {
  'wakeUpEarly': 'Wakeup early',
  'we': 'Wakeup early',
  'sleepEarly': 'Sleep early',
  'se': 'Sleep early',
  'fasting': 'Fasting',
  'fa': 'Fasting',
  'stretches': 'Stretches',
  'st': 'Stretches',
  'coldShower': 'Cold shower',
  'cs': 'Cold shower',
  'skinCare': 'Skin care',
  'sc': 'Skin care',
  'touchFace': 'Touch face',
  'tf': 'Touch face',
  'nut': 'Nut',
  'sugar': 'Sugar',
  'su': 'Sugar',
};

export {
    parseArg,
    getHabitFn,
    attributeMap,
}
