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
  assert(run("SON/DEMO/DEMO").lines[0].includes("SIGN IN COMPLETE"));
  const avail = run("A01APRDACJED");
  assert.strictEqual(avail.kind, "avail");
  assert(avail.header.includes("DHAKA"));
  assert.strictEqual(avail.flights.length, 8);
  assert(avail.hasMore);
  const page2 = run("MD");
  assert.strictEqual(page2.kind, "avail");
  assert.strictEqual(page2.flights[0].line, 9);
  const sell = run("N1Y1");
  assert.strictEqual(sell.kind, "sell");
  assert(sell.lines[0].includes("SV"));
  assert(run("N/DOE/JOHN MR").lines[0].includes("DOE/JOHN"));
  run("9/8801712345678");
  const saved = run("ER");
  assert(saved.lines[0].includes("RLR"));
  assert(engine.state.locator);
  const fare = run("FQ");
  assert(fare.lines.some(line => line.includes("TOTAL")));
  assert(run("FXP").lines[0].includes("TST"));
  assert(run("TKPFS/DTDAD").lines[0].includes("ETK ISSUED"));
}

const roots = [path.resolve(__dirname, "..")];
const androidJs = path.resolve(__dirname, "..", "android", "app", "src", "main", "assets");
if (fs.existsSync(path.join(androidJs, "js", "commands.js"))) roots.push(androidJs);

for (const root of roots) {
  const context = loadContext(root);
  assert(context.GalileoAirports.find("DAC"));
  assert(context.GalileoAirports.find("JFK"));
  assert.strictEqual(context.GalileoAirports.decode("MUX").city, "Multan");
  assert(context.GalileoLessons.get("BASIC"));
  testBooking(context);
}

console.log("Galileo simulator smoke tests passed");
