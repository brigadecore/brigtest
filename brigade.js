const {events, Job} = require("brigadier")

// To run this: `brigtest -c example-config.json`
events.on("exec", (e, p) => {

  if (p.secrets.isBrigtest) {
    console.log("we are running a test!");
  }

  var j = new Job("hello", "alpine:3.7");

  // Note that we have to mock out the response in example-config.json
  j.tasks = [
    "echo hello world"
  ];

  j.storage.enabled = true;

  j.run().then( res => {
    if (res.toString() != "hello world") {
      throw new Error(`Expected hello, got "${ res.toString() }"`)
    }
  });
})

// To run this: `brigtest -c example-config.json -e fail`
events.on("fail", (e, p) => {
  const j = new Job("do-error", "alpine:3.7");

  // This will fail because example-config.json has "error" for this.
  j.run()
})
