#!/usr/bin/env node
const vm = require("vm");
const fs = require("fs");
const {ulid} = require("ulid");
const brigadier = require("./brigadier");
var program = require("commander");

program
  .version("0.1.0")
  .option("-f, --brigade-script <file>", "Specify a 'brigade.js' file. Default is ./brigade.js.")
  .option("-e, --event <name>", "Run the given event. Default is 'exec'. This will override whatever is in --config.")
  .option("-p, --payload <file>", "Override the payload for the event.")
  .option("-c, --config <file>", "Path to configuration. Default will generate a base event and project.")
  .option("-x, --syntax", "Only check syntax, then exit.")
  .parse(process.argv)

var script = fs.realpathSync(program.brigadeScript || "./brigade.js");
var raw = fs.readFileSync(script)

var userConfig = program.config ? loadParse(program.config) : {}
var config = {
  rules: userConfig.rules || [],
  event: userConfig.event || {
    type: "exec",
    buildID: ulid(),
    workerID: "faux-worker",
    provider: "brigtest",
    revision: { ref: "refs/heads/master" },
    payload: program.payload ? fs.readFileSync(program.payload).toString() : "",
  },
  project: userConfig.project || {
    id: "brigade-407900363c01e6153bc1a91792055b898e20a29f1387b72a0b6f00",
    name: "technosophos/-whale-eyes-",
    repo: {
      name: "https://github.com/technosophos/-whale-eyes-",
      cloneURL: "https://github.com/technosophos/-whale-eyes-.git",
      initGitSubmodules: false,
    },
    kubernetes: {},
    secrets: {},
    allowPrivilegedJobs: true,
    allowHostMounts: true,
  }
}

if (program.event) {
  config.event.type = program.event;
}

if (program.payload) {
  config.event.payload = fs.readFileSync(program.payload)
}

brigadier.setConfig(config);

// Single-use require wrapper for loading brigadier fixture
const overridingRequire = function (pkg) {
  if ( pkg == "brigadier" ) {
    return brigadier.fixture
  }
  return require(pkg)
};

const ctx = vm.createContext({
  module: module,
  require: overridingRequire,
  console: console,
});
const x = new vm.Script(raw, {filename: script})

if (program.syntax) {
  return
}
x.runInContext(ctx)

process.on("unhandledRejection", (reason, p) => {
  console.error(`FATAL: ${ reason }`);
  process.exit(1);
})
process.on("uncaughtException", (reason, p) => {
  console.error(`FATAL: ${ reason }`);
  process.exit(1);
})

brigadier.fireFromConfig()

function loadParse(filename) {
  return JSON.parse(fs.readFileSync(filename))
}

