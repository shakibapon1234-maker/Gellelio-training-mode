const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadContext(root) {
  const context = { console };
  context.window = context;
  vm.createContext(context);
  ["airports.js", "flights.js", "fareShop.js", "lessons.js", "commands.js"].forEach(file => {
    vm.runInContext(fs.readFileSync(path.join(root, "js", file), "utf8"), context, { filename: file });
  });
  return context;
}

function testBooking(context) {
  const engine = new context.GalileoCommandEngine();
  const run = command => engine.process(command);
  assert(run("SON/DEMO/DEMO").lines[0].includes("SIGN IN"));
  assert(run("A01APRDACJED").lines[0].includes("AVAILABILITY"));
  assert.strictEqual(run("N1Y1").lines[0], "SELL CONFIRMED");
  assert(run("N/DOE/JOHN MR").lines[0].includes("NAME ADDED"));
  run("9/8801712345678");
  assert(run("ER").lines[0].includes("PNR CREATED"));
  assert.strictEqual(run("FQ").lines[0], "FARE QUOTE");
  assert(run("FXP").lines[0].includes("FARE STORED"));
  assert(run("TKPFS/DTDAD").lines[0].includes("TICKET ISSUED"));
}

for (const root of [path.resolve(__dirname, ".."), path.resolve(__dirname, "..", "android", "app", "src", "main", "assets")]) {
  const context = loadContext(root);
  assert(context.GalileoAirports.find("DAC"));
  assert(context.GalileoAirports.find("JFK"));
  assert.strictEqual(context.GalileoAirports.decode("MUX").city, "Multan");
  assert(context.GalileoLessons.get("BASIC"));
  testBooking(context);
}

console.log("Galileo simulator smoke tests passed");
