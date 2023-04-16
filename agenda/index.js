import { Logging } from "../helpers.js";
import { updateDate } from "./updateDate.js";
import { addTodo } from "./addTodo.js";

const getAgendaFn = (cmd, ...args) => {
  if (cmd === 'update') {
    return updateDate
  }
  if (cmd === 'todo') {
    return () => addTodo(...args)
  }
}

(() => {
  if (process.argv.length <= 2) {
    Logging.error('Wrong Args Number -_-||')
    return
  }
  const args = process.argv.slice(2)
  const scriptName = args[0];
  const restArgs = args.slice(1);
  getAgendaFn(scriptName, ...restArgs)();
})();
  