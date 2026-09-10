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
  assert.strictEqual(run("*P").leftDisplay, "phone");
  assert.strictEqual(run("*TD").leftDisplay, "ticketing");
  assert(run("SI.P1/SSRCTCEBGHK1/WINGSFLY//GMAIL.COM *").lines[0].includes("EMAIL ADDED"));
  assert(run("SI.P1/SSRCTCMTGHK1/01715208244 *").lines[0].includes("MOBILE ADDED"));
  assert(run("SI.P1/MOML *").lines[0].includes("MUSLIM MEAL ADDED"));
  assert(run("SI.P1/WCHR/NEEDS WHEELCHAIR TO AIRCRAFT *").lines[0].includes("WHEELCHAIR TO RAMP ADDED"));
  assert(run("SI.P1/WCHR*").lines[0].includes("MUST BE FOLLOWED BY TEXT"));
  assert.strictEqual(run("*SI").leftDisplay, "service");
  assert.strictEqual(engine.state.ssr.length, 4);
  run("R.H");
  const saved = run("ER");
  assert.strictEqual(saved.clearTerminal, true);
  assert(engine.state.locator);
  assert.strictEqual(engine.state.saved, true);
  assert.strictEqual(run("IR").leftDisplay, "overview");
  assert.strictEqual(run("*ALL").leftDisplay, "all");
  assert.strictEqual(run("*VL").leftDisplay, "vendorLocator");
  const remarks = run("*VR");
  assert.strictEqual(remarks.leftDisplay, "vendorRemarks");
  assert(engine.state.vendorRemarks.includes("ADTK1G"));
  const cancelled = run("XI");
  assert.strictEqual(cancelled.kind, "cancel");
  assert.strictEqual(engine.state.segments.length, 0);
  assert.strictEqual(engine.state.itineraryCancelled, true);
  const fare = run("FQ");
  assert(fare.lines.some(line => line.includes("TOTAL")));
  assert(run("FXP").lines[0].includes("TST"));
  assert(run("TKPFS/DTDAD").lines[0].includes("ETK ISSUED"));

  // ER must create a PNR for both availability and fare-shopping flows as
  // soon as a segment and passenger name are present.
  const minimal = new context.GalileoCommandEngine();
  const minimalRun = command => minimal.process(command);
  minimalRun("SON/DEMO/DEMO");
  minimalRun("A01APRDACJED");
  minimalRun("N1Y1");
  minimalRun("N/DOE/JANE MS");
  assert.strictEqual(minimalRun("ER").kind, "end");
  assert(minimal.state.locator);
  assert.strictEqual(minimalRun("IR").leftDisplay, "overview");

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
  assert.strictEqual(ignored.lines[0], "IGNORED - CHANGES DISCARDED");
  assert.strictEqual(restore.state.ssr.length, 0);
  assert.strictEqual(restore.state.names.length, 0);
  assert.strictEqual(restore.state.segments.length, 0);
  assert.strictEqual(restore.state.locator, null);
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
