import { cmds, getCmdListStr } from "./helper.js";
import { Logging } from "../helpers.js";

(() => {
  if (process.argv.length <= 2) {
    Logging.error("Empty command!\nPlease choose the following commands instead:")
    Logging.warn(getCmdListStr())
    process.exit(0)
  }
  const args = process.argv.slice(2)
  const scriptName = args[0];
  const restArgs = args.slice(1);
  if (!cmds[scriptName]) {
    Logging.error("Command not found!\nPlease choose the following commands instead:")
    Logging.warn(getCmdListStr())
    process.exit(0)
  }
  cmds[scriptName](...restArgs);
})();
