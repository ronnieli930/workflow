import { updateDate } from "./updateDate.js";
import { addTodo } from "./addTodo.js";
import { addLog } from "./addLog.js";

const cmdObj = {
  update:{
    cmds: ['update', 'up'],
    fn: updateDate
  },
  todo:{
    cmds: ['todo', 'td'],
    fn: addTodo
  },
  entryLog:{
    cmds: ['log', 'lg', 'lo'],
    fn: addLog
  },
}

const getCmdListStr = () => Object.values(cmdObj).map(e => e.cmds.join(', ')).join('\n')

const reverseCmdMap = Object.values(cmdObj).map(obj => (
  obj.cmds.map(cmd => ({[cmd]: obj.fn }))
)).flat().reduce((acc, val) => ({...acc, ...val}), {})

export {
  getCmdListStr,
  reverseCmdMap as cmds,
}
