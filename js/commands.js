(function (global) {
  const steps = ["login", "availability", "sell", "name", "contact", "save", "price", "issue"];

  function freshState() {
    return { signedIn: false, availability: false, results: [], segment: null, name: null, phone: null, ticketing: null, receivedFrom: null, locator: null, priced: false, fare: null, storedFare: false, issued: false, saved: false, ssr: [], history: [] };
  }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  class GalileoCommandEngine {
    constructor() { this.reset(); }

    reset() { this.state = freshState(); }

    process(raw) {
      const command = raw.trim().toUpperCase();
      if (!command) return { lines: [], kind: "" };
      this.state.history.push(raw);
      if (command === "HELP" || command === "GG HELP") return { lines: ["CORE TRAINING COMMANDS", "SON/AGENCY/PASSWORD  Sign in", "SOF                  Sign out", "A01APRDACJED         Display availability", "N1Y1                 Sell line 1, Y class, 1 passenger", "N/DOE/JOHN MR        Add passenger name", "9/8801712345678      Add contact", "T-01APR              Add ticketing time limit", "RF-JOHN              Received from", "ER                   End and retrieve PNR", "FQ / FXP             Quote and store fare", "TKPFS/DTDAD          Issue ticket", "X1                   Cancel segment 1", "SI.SSR MEAL          Add special service", "C DAC                Decode airport code", "IG                   Ignore unsaved booking"] };
      if (command.startsWith("SON/")) { this.state.signedIn = true; return { lines: ["SIGN IN COMPLETE", "OFFICE ID: DACVS01  DUTY: TRAINING", "WELCOME TO GELLELIO GALILEO"] }; }
      if (command === "SOF") { this.state.signedIn = false; return { lines: ["SIGN OFF COMPLETE"] }; }
      if (!this.state.signedIn) return this.error("SIGN IN REQUIRED - ENTER SON/AGENCY/PASSWORD");

      const availability = command.match(/^A(\d{2}[A-Z]{3})([A-Z]{3})([A-Z]{3})(?:\*([A-Z0-9]+))?$/);
      if (availability) {
        const [, date, origin, destination] = availability;
        if (!GalileoAirports.find(origin) || !GalileoAirports.find(destination)) return this.error("INVALID AIRPORT CODE - USE C CODE TO VERIFY");
        if (origin === destination) return this.error("ORIGIN AND DESTINATION MUST BE DIFFERENT");
        this.state.results = GalileoFlights.search({ date, origin, destination });
        this.state.availability = true;
        if (!this.state.results.length) return { lines: [`NO FLIGHTS FOUND ${date} ${origin}${destination}`], kind: "error" };
        return { lines: [`GALILEO AVAILABILITY - ${date} - ${origin}/${destination}`, ...this.state.results.map(GalileoFlights.format), "> SELL FORMAT: N1Y1"] };
      }
      const sell = command.match(/^N(\d+)([A-Z])(\d+)$/);
      if (sell) {
        const flight = GalileoFlights.byLine(Number(sell[1]), this.state.results);
        if (!this.state.availability || !flight) return this.error("NEED A VALID AVAILABILITY LINE FIRST");
        this.state.segment = clone(flight);
        return { lines: ["SELL CONFIRMED", `${flight.line} ${flight.carrier}${flight.number} ${flight.cls} HK${sell[3]} ${flight.origin}${flight.destination} ${flight.date}`] };
      }
      if (command.startsWith("C ")) {
        const decoded = GalileoAirports.decode(command.slice(2));
        return decoded ? { lines: [`${decoded.code}  ${decoded.city}`, decoded.country] } : this.error("AIRPORT CODE NOT FOUND");
      }
      if (command.startsWith("N/")) {
        const value = command.slice(2);
        if (!value.includes("/")) return this.error("FORMAT ERROR - USE N/SURNAME/FIRSTNAME TITLE");
        this.state.name = value;
        return { lines: [`NAME ADDED - ${value}`] };
      }
      if (command.startsWith("9/")) { this.state.phone = command.slice(2); return { lines: [`CONTACT ADDED - ${this.state.phone}`] }; }
      if (command.startsWith("T-")) { this.state.ticketing = command.slice(2); return { lines: [`TICKETING TIME LIMIT SET - ${this.state.ticketing}`] }; }
      if (command.startsWith("RF-")) { this.state.receivedFrom = command.slice(3); return { lines: [`RECEIVED FROM - ${this.state.receivedFrom}`] }; }
      if (command === "ER" || command === "E") {
        if (!this.state.segment || !this.state.name) return this.error("UNABLE TO END - NAME AND SEGMENT REQUIRED");
        this.state.saved = true;
        this.state.locator = "G7L3QK";
        return { lines: [`PNR CREATED - ${this.state.locator}`, this.state.name, `${this.state.segment.carrier}${this.state.segment.number} HK1 ${this.state.segment.origin}${this.state.segment.destination}`] };
      }
      if (command.startsWith("*")) {
        if (command.slice(1) !== this.state.locator) return this.error("RECORD NOT FOUND");
        return { lines: [`RETRIEVED PNR ${this.state.locator}`, this.state.name || "NO NAME", this.state.segment ? `${this.state.segment.carrier}${this.state.segment.number} HK1 ${this.state.segment.origin}${this.state.segment.destination}` : "NO AIR SEGMENT"] };
      }
      if (command === "FQ") {
        if (!this.state.segment) return this.error("NO AIR SEGMENT TO QUOTE");
        this.state.fare = GalileoFareShop.quote(this.state.segment);
        this.state.priced = true;
        return { lines: ["FARE QUOTE", `${this.state.segment.origin}-${this.state.segment.destination}  ${this.state.segment.carrier}${this.state.segment.number}`, `BASE FARE                 ${this.state.fare.currency} ${this.state.fare.base.toLocaleString()}`, `TAXES                     ${this.state.fare.currency} ${this.state.fare.taxes.toLocaleString()}`, `TOTAL                     ${this.state.fare.currency} ${this.state.fare.total.toLocaleString()}`] };
      }
      if (command === "FXP") {
        if (!this.state.priced) return this.error("FARE QUOTE REQUIRED - ENTER FQ FIRST");
        this.state.storedFare = true;
        return { lines: ["FARE STORED - TST 00001 CREATED"] };
      }
      if (command.startsWith("TKP")) {
        if (!this.state.storedFare || !this.state.saved) return this.error("PNR MUST BE SAVED AND FARE STORED BEFORE ISSUE");
        this.state.issued = true;
        return { lines: ["TICKET ISSUED SUCCESSFULLY", "TICKET NUMBER: 999-1234567890", `PNR: ${this.state.locator}`, "STATUS: CONFIRMED"] };
      }
      const cancel = command.match(/^X(\d+)$/);
      if (cancel) {
        if (!this.state.segment || Number(cancel[1]) !== 1) return this.error("SEGMENT NOT FOUND");
        this.state.segment = null;
        this.state.priced = false;
        this.state.storedFare = false;
        return { lines: ["SEGMENT 1 CANCELLED"] };
      }
      if (command.startsWith("SI.SSR ")) { this.state.ssr.push(command.slice(7)); return { lines: [`SSR ADDED - ${command.slice(7)}`] }; }
      if (command === "IG") { this.reset(); return { lines: ["PNR IGNORED - CHANGES DISCARDED"] }; }
      return this.error("UNABLE TO PROCESS - TYPE HELP FOR COMMANDS");
    }

    error(line) { return { lines: [line], kind: "error" }; }
  }

  global.GalileoCommandEngine = GalileoCommandEngine;
  global.GalileoSteps = steps;
}(window));