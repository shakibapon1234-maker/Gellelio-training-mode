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
  assert.strictEqual(avail.flights.length, 15);
  assert(avail.hasMore);
  const page2 = run("MD");
  assert.strictEqual(page2.kind, "avail");
  assert.strictEqual(page2.flights[0].line, 16);
  const sell = run("N1Y1");
  assert.strictEqual(sell.kind, "sell");
  assert(sell.lines[0].includes("SV"));
  const name = run("N/DOE/JOHN MR");
  assert(name.lines[0].includes("N/DOE/JOHN MR"));
  assert(name.lines.some(line => line.includes("SOLD SEGMENTS")));
  const contact = run("P.T* WINGS FLY REF SHAKIB 01757208244 *");
  assert(contact.lines[0].includes("WINGS FLY REF SHAKIB 01757208244 *"));
  const contactAlias = run("P.P* ANY FREE TEXT");
  assert(contactAlias.lines[0].includes("ANY FREE TEXT"));
  run("T.T*");
  assert(run("*P").lines[0].includes("WINGS FLY REF SHAKIB 01757208244 *"));
  assert(run("*TD").lines[0].includes("T.T*"));
  run("R.H");
  const saved = run("ER");
  assert.strictEqual(saved.clearTerminal, true);
  assert(engine.state.locator);
  assert.strictEqual(engine.state.saved, true);
  const fare = run("FQ");
  assert(fare.lines.some(line => line.includes("TOTAL")));
  assert(run("FXP").lines[0].includes("TST"));
  assert(run("TKPFS/DTDAD").lines[0].includes("ETK ISSUED"));

  const discard = new context.GalileoCommandEngine();
  const discardRun = command => discard.process(command);
  discardRun("SON/DEMO/DEMO");
  discardRun("A01APRDACJED");
  discardRun("N1Y1");
  discardRun("N/DOE/JOHN MR");
  assert.strictEqual(discardRun("I").kind, "ignore");
  assert.strictEqual(discard.state.segments.length, 0);
  assert.strictEqual(discard.state.names.length, 0);

  const restore = new context.GalileoCommandEngine();
  const restoreRun = command => restore.process(command);
  restoreRun("SON/DEMO/DEMO");
  restoreRun("A01APRDACJED");
  restoreRun("N1Y1");
  restoreRun("N/DOE/JOHN MR");
  restoreRun("P.T*WINGS FLY REF SHAKIB 01757208244");
  restoreRun("T.T*");
  restoreRun("R.H");
  restoreRun("ER");
  restoreRun("SI.SSR MEAL");
  const ignored = restoreRun("I");
  assert(ignored.lines[0].includes("SAVED PNR RESTORED"));
  assert.strictEqual(restore.state.ssr.length, 0);
  assert.strictEqual(restore.state.names[0], "1-DOE/JOHN MR");
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
