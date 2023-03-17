var { removeScriptFn } = require('./helpers.js');

const RESERVED_CMD = [
  "ping",
  "edit",
  "show",
  "open",
  "add-script",
  "add",
];

(() => {
  const keys = process.argv.slice(2)
  removeScriptFn(...keys)
})()
