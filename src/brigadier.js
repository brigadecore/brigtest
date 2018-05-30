const ev = require("../generated/events")
const jobs = require("../generated/job");
const groups = require("../generated/group");

var emitter = new ev.EventRegistry()
var currentEvent;
var currentProject;
var config = {
  rules: []
}

class ErrorReport{}
class JobFixture extends jobs.Job {
  run() {
    for (let r of config.rules) {
      if (r.jobName == this.name) {
        if (r.error) {
          return Promise.reject(new Error(r.error))
        }
        return Promise.resolve(r.output || "found");
      }
    }
    return Promise.resolve("done")
  }
  logs() {
    return "log";
  }
}

module.exports.setConfig = (cfg) => {
  config = cfg;
}

module.exports.fixture = {
  events: emitter,
  fire: (e, p) => {
    currentEvent = e;
    currentProject = p;
    emitter.fire(e, p);
  },
  Job: JobFixture,
  Group: groups.Group,
  ErrorReport: ErrorReport
}

module.exports.fire = function (evnt, proj) {
  return emitter.fire(evnt, proj)
};

module.exports.fireFromConfig = function() {
  return emitter.fire(config.event, config.project)
}
