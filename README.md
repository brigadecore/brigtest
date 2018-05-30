# brigtest: Test Your Brigade.js

This is a trivial testing tool for checking your [Brigade](https://brigade.sh) script.

This loads a `brigade.js`-style file, sets up a testing fixture, and runs the
script. It will _not_ run containers or contact Kubernetes. It will simulate
an execution of Brigade.

This tool is useful for running an automated functional test against a brigade.js.
If you write tests into your `brigade.js` file, you can run them from here, as
well.

## Executing an Event

The normal mode for `brigtest` is to run the script, attaching the following
mocks:

- `events`
- `Job`
- `Group`

Normal Brigade scripts will be able to run with these.

## Modeling Behavior

Brigade scripts take the following as input:

- An event object
  - Optionally with a payload
- A project

Then they execute jobs against container images, and receive back string data
from those containers, along with a failure if the pod fails to run.

The `brigtest` command allows you to simulate all of these by passing in configuration
data.

A configuration file contains JSON with the following four main sections:

- `event`: Optional override of the event. If no override is specified, `brigtest`
  will construct a basic event targeting `exec` or whatever event is specified with `-e`.
- `project`: Optional project. If no project is specified, `brigtest` constructs a
  basic project.
- `rules`: Optional array of rules that explain how jobs should be mocked. Specify
  a job name and an output, and `job.run()` will return that output wrapped in a
  promise. This is used for mocking data.

Here is an example that shows all three sections:

```json
{
  "rules": [
    {
      "jobName": "hello",
      "output": "hello world"
    },
    {
      "jobName": "goodbye",
      "output": "goodbye world"
    },
    {
      "jobName": "do-error",
      "error": "failed to win"
    }
  ],
  "event": {
    "type": "exec",
    "buildID": "01CESG1PNQD4ZG0KG89V1KMKXT",
    "workerID": "faux-worker",
    "provider": "brigtest",
    "revision": {
      "ref": "refs/heads/master"
    },
    "payload": ""
  },
  "project": {
    "id": "brigade-407900363c01e6153bc1a91792055b898e20a29f1387b72a0b6f00",
    "name": "technosophos/-whale-eyes-",
    "repo": {
      "name": "https://github.com/technosophos/-whale-eyes-",
      "cloneURL": "https://github.com/technosophos/-whale-eyes-.git",
      "initGitSubmodules": false
    },
    "kubernetes": {},
    "secrets": {},
    "allowPrivilegedJobs": true,
    "allowHostMounts": true
  }
}
```

Note that you can override the event name (`-e`) and the payload (`-p`) from the
command line tool. But all other fields must be set in the config file.

## Syntax Checking

To use this as a syntax checker, you can do `brigtest -x`. This will merely
load the script. It will print a message if syntax checking fails.
