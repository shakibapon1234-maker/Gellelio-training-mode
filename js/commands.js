(function (global) {

  const STEPS = ["login","availability","sell","name","contact","save","price","issue"];

  // Day abbreviations for date display
  const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

  function dayOfDate(dateStr) {
    // dateStr like "01APR" — use a fixed reference (01APR27 = THU)
    const MONTHS = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
    const d = parseInt(dateStr.slice(0,2));
    const m = MONTHS[dateStr.slice(2,5)];
    const dt = new Date(2027, m, d);
    return DAYS[dt.getDay()];
  }

  function freshState() {
    return {
      signedIn: false,
      officeId: null,
      availability: false,
      availHeader: null,
      results: [],
      segments: [],          // array of sold segments (multi-segment support)
      names: [],             // array of passenger names
      phones: [],
      ticketing: null,
      receivedFrom: null,
      locator: null,
      priced: false,
      fare: null,
      storedFare: false,
      issued: false,
      saved: false,
      ssr: [],
      osk: [],               // OSI remarks
      history: [],
      availPage: 0,
      lastAvailCmd: null
    };
  }

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  // Generate a random 6-char alphanumeric PNR locator
  function genLocator() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i=0;i<6;i++) s += chars[Math.floor(Math.random()*chars.length)];
    return s;
  }

  // Build city names from airport codes
  function cityPair(orig, dest) {
    const a = GalileoAirports.find(orig);
    const b = GalileoAirports.find(dest);
    const ac = a ? a.city.toUpperCase() : orig;
    const bc = b ? b.city.toUpperCase() : dest;
    return `${ac}/${bc}`;
  }

  class GalileoCommandEngine {
    constructor() { this.reset(); }
    reset() { this.state = freshState(); }

    process(raw) {
      const cmd = raw.trim().toUpperCase();
      if (!cmd) return { lines: [], kind: "" };
      this.state.history.push(raw.trim());

      // ── HELP ──
      if (cmd === "HELP" || cmd === "GG HELP") {
        return { lines: [
          "GELLELIO GALILEO — CORE TRAINING COMMANDS",
          "─────────────────────────────────────────",
          "SON/ZHA                 Sign on with staff initials",
          "SOF                     Sign off",
          "A22JUNDACDXB            Neutral availability",
          "A22JUNDACDXB*EK         Carrier-specific availability",
          "MD / MU / MT / MB       Move down / up / top / bottom",
          "N1Y1                    Sell 1 seat, Y class, line 1",
          "N.RAHMAN/MD HAFIZUR MR  Name insert (adult)",
          "P.T*AGENCY REF NAME 01  Phone field (max 53 characters)",
          "T.T*                    Ticketing agreement (mandatory)",
          "R.H                     Received field",
          "ER                      End and retrieve",
          "IR                      Redisplay booking file",
          "*LOCATOR                Open PNR",
          "*ALL                    Display all PNR elements",
          "FQCEK/ET                Fare load",
          "XI                      Cancel booking",
          "LESSON BASIC            Show booking steps from course sheet"
        ]};
      }

      // ── SIGN IN: SON/AGENCY/PASSWORD ──
      if (cmd.startsWith("SON/")) {
        const initials = cmd.slice(4).trim();
        if (!initials) return this.error("FORMAT: SON/ZHA");
        this.state.signedIn = true;
        this.state.officeId = "DACVS086JJ";
        this.state.signOn = initials.split("/")[0];
        return { lines: [
          "SIGN IN COMPLETE",
          `OFFICE ID  : ${this.state.officeId}`,
          "DUTY CODE  : SU",
          "TRAINING   : GELLELIO GALILEO PRACTICE SIMULATOR"
        ]};
      }

      // ── SIGN OUT ──
      if (cmd === "SOF") {
        this.state.signedIn = false;
        return { lines: ["SIGN OFF COMPLETE", `OFFICE: ${this.state.officeId || "DACVS086JJ"}`] };
      }

      if (!this.state.signedIn) return this.error("SIGN IN REQUIRED - ENTER: SON/ZHA");

      // ── MOVE DISPLAY (availability paging) ──
      if (cmd === "MD" || cmd === "MU" || cmd === "MT" || cmd === "MB") {
        if (!this.state.results.length) return this.error("NO AVAILABILITY DISPLAYED");
        const size = GalileoCommandEngine.PAGE_SIZE;
        const maxPage = Math.max(0, Math.ceil(this.state.results.length / size) - 1);
        if (cmd === "MD") {
          if (this.state.availPage >= maxPage) return this.error("BOTTOM OF DISPLAY");
          this.state.availPage++;
        } else if (cmd === "MU") {
          if (this.state.availPage <= 0) return this.error("TOP OF DISPLAY");
          this.state.availPage--;
        } else if (cmd === "MT") this.state.availPage = 0;
        else this.state.availPage = maxPage;
        return this._availScreen();
      }

      // ── AVAILABILITY: A22JUNDACDXB  /  A22JUNDACDXB*EK  /  A22JUNDACDXB.D ──
      const avail = cmd.match(/^A(\d{2}[A-Z]{3})([A-Z]{3})([A-Z]{3})(\*[A-Z]{2})?(\.D)?$/);
      if (avail) {
        const [, dateStr, orig, dest, pref] = avail;
        const aOrig = GalileoAirports.find(orig);
        const aDest = GalileoAirports.find(dest);
        if (!aOrig) return this.error(`AIRPORT NOT FOUND - ${orig} - USE C CODE`);
        if (!aDest) return this.error(`AIRPORT NOT FOUND - ${dest} - USE C CODE`);
        if (orig === dest) return this.error("ORIGIN AND DESTINATION MUST DIFFER");

        const carrier = pref ? pref.slice(1) : null;
        const results = GalileoFlights.search({ origin: orig, destination: dest, carrier: carrier });
        this.state.results = results;
        this.state.availability = true;
        this.state.availPage = 0;
        this.state.lastAvailCmd = cmd;

        if (!results.length) return { lines: [`NO AVAILABILITY - ${dateStr} ${orig}${dest}`], kind: "error" };

        const day  = dayOfDate(dateStr);
        const pair = cityPair(orig, dest);
        this.state.availHeader = `${day} ${dateStr}27        ${pair}        01/0000 01/2359`;
        return this._availScreen();
      }

      // ── SELL: N3K2 = pax + class + line (Wings Fly course sheet) ──
      const sellMulti = cmd.match(/^N(\d+)([A-Z])(\d+)([A-Z])(\d+)$/);
      if (sellMulti) {
        const paxCount = parseInt(sellMulti[1]);
        const first = this._sellOne(parseInt(sellMulti[3]), sellMulti[2], paxCount);
        if (first.error) return first.error;
        const second = this._sellOne(parseInt(sellMulti[5]), sellMulti[4], paxCount);
        if (second.error) return second.error;
        return second.resp;
      }
      const sell = cmd.match(/^N(\d+)([A-Z])(\d+)\*?$/);
      if (sell) {
        const paxCount = parseInt(sell[1]);
        const cls      = sell[2];
        const lineNum  = parseInt(sell[3]);
        const sold = this._sellOne(lineNum, cls, paxCount);
        if (sold.error) return sold.error;
        return sold.resp;
      }

      // ── DECODE: C DAC ──
      if (cmd.startsWith("C ")) {
        const code = cmd.slice(2).trim();
        const ap = GalileoAirports.decode(code);
        if (ap) return { lines: [`${ap.code}  ${ap.city}`, ap.country, ap.name] };
        // Try encode (city name search)
        const enc = GalileoAirports.encode(code);
        if (enc.length) return { lines: enc.map(([c,a]) => `${c}  ${a.city}, ${a.country}  ${a.name}`).slice(0,8) };
        return this.error("CODE NOT FOUND");
      }

      // ── NAME: N.RAHMAN/MD HAFIZUR MR  (also N/ from live Smartpoint) ──
      if (cmd.startsWith("N.") || cmd.startsWith("N/")) {
        const val = raw.trim().slice(2);
        if (!val.includes("/")) return this.error("CHECK FORMAT");
        const prefix = cmd.startsWith("N.") ? "N." : "N/";
        const nameFormatted = (this.state.names.length + 1) + "-" + prefix + val.toUpperCase();
        this.state.names.push(nameFormatted);
        return { lines: [nameFormatted], kind: "" };
      }

      // ── PHONE: P.T*WINGS FLY ... REF HAFIZ 01618000488 ──
      if (cmd.startsWith("P.T*") || cmd.startsWith("P.")) {
        if (!cmd.startsWith("P.T*")) return this.error("CHECK FORMAT");
        const phone = raw.trim().slice(4);
        if (!phone) return this.error("CHECK FORMAT");
        this.state.phones.push(phone);
        return { lines: ["P.T*" + phone.toUpperCase()] };
      }

      // ── TICKETING AGREEMENT: T.T* ──
      if (cmd === "T.T*" || cmd.startsWith("T.T*")) {
        this.state.ticketing = "T.T*";
        return { lines: ["T.T*"] };
      }
      if (cmd === "T.T" || cmd.startsWith("T-")) {
        return this.error("CHECK FORMAT");
      }

      // ── RECEIVED FIELD: R.H ──
      if (cmd.startsWith("R.")) {
        this.state.receivedFrom = raw.trim().slice(2) || "H";
        return { lines: ["R." + this.state.receivedFrom.toUpperCase()] };
      }
      if (cmd.startsWith("RF-")) {
        this.state.receivedFrom = raw.trim().slice(3);
        return { lines: ["R." + this.state.receivedFrom.toUpperCase()] };
      }

      // ── END & RETRIEVE: ER or E ──
      if (cmd === "ER" || cmd === "E") {
        if (!this.state.segments.length) return this.error("NO SEGMENT - ADD AIR SEGMENT FIRST");
        if (!this.state.names.length)    return this.error("CHECK FORMAT - NAME FIELD REQUIRED");
        if (!this.state.phones.length)   return this.error("CHECK FORMAT - PHONE FIELD REQUIRED");
        if (!this.state.ticketing)       return this.error("CHECK FORMAT - ENTER: T.T*");
        if (!this.state.receivedFrom)    return this.error("CHECK FORMAT - ENTER: R.H");
        this.state.saved   = true;
        this.state.locator = this.state.locator || genLocator();
        const seg  = this.state.segments[0];
        const name = this.state.names[0];
        return { lines: [
          `--- RLR ---`,
          `RP/${this.state.officeId || "DACVS086JJ"}/${this.state.officeId || "DACVS086JJ"}              ${this.state.receivedFrom || "TRAINING"}/SU`,
          `${this.state.locator}`,
          `${name}`,
          `${seg.segNum} ${seg.carrier} ${seg.number} ${seg.soldClass} ${seg.date} ${seg.origin}${seg.destination} HK${seg.paxCount} ${seg.depart} ${seg.arrive}   #`,
          this.state.ticketing ? `TL ${this.state.ticketing}` : "",
          this.state.phones.length ? `AP ${this.state.phones[0]}` : ""
        ].filter(l => l !== "") };
      }

      // ── RETRIEVE PNR: *LOCATOR ──
      if (cmd.startsWith("*") && !cmd.startsWith("*ALL") && !cmd.startsWith("*RV")) {
        const loc = cmd.slice(1);
        if (loc !== this.state.locator) return this.error(`RECORD LOCATOR ${loc} NOT FOUND`);
        return this._displayPNR();
      }

      // ── *ALL: display full PNR ──
      if (cmd === "*ALL") {
        if (!this.state.locator) return this.error("NO ACTIVE PNR - RETRIEVE FIRST");
        return this._displayPNR();
      }

      // ── *RV: re-display (same as retrieve) ──
      if (cmd === "*RV") {
        if (!this.state.locator) return this.error("NO ACTIVE PNR");
        return this._displayPNR();
      }

      // ── FARE QUOTE: FQ ──
      if (cmd === "FQ") {
        if (!this.state.segments.length) return this.error("NO AIR SEGMENT TO QUOTE");
        const seg  = this.state.segments[0];
        const fare = GalileoFareShop.quote(seg);
        this.state.fare   = fare;
        this.state.priced = true;
        return { lines: [
          `DAC ${seg.origin}-${seg.destination}  ${seg.carrier}${seg.number}/${seg.soldClass || "Y"}  ${seg.date}`,
          ``,
          `  FARE BASIS : ${fare.reference}`,
          `  BASE FARE  : BDT ${fare.base.toLocaleString()}`,
          `  TAXES/FEES : BDT ${fare.taxes.toLocaleString()}`,
          `  ─────────────────────────────────`,
          `  TOTAL      : BDT ${fare.total.toLocaleString()}`,
          ``,
          `LAST DAY TO PURCHASE: ${this.state.ticketing || "SEE CONDITIONS"}`,
          `ENTER FXP TO STORE FARE`
        ]};
      }

      // ── FXP: store fare / create TST ──
      if (cmd === "FXP") {
        if (!this.state.priced) return this.error("FARE NOT QUOTED - ENTER FQ FIRST");
        this.state.storedFare = true;
        return { lines: [
          "TST 00001 CREATED",
          `BDT ${this.state.fare.total.toLocaleString()}`,
          "ENTER TKPFS/DTDAD TO ISSUE TICKET"
        ]};
      }

      // ── ISSUE TICKET: TKPFS/DTDAD or TKP... ──
      if (cmd.startsWith("TKP") || cmd.startsWith("TKPFS")) {
        if (!this.state.storedFare) return this.error("STORE FARE FIRST - ENTER FXP");
        if (!this.state.saved)      return this.error("SAVE PNR FIRST - ENTER ER");
        this.state.issued = true;
        const tktNum = `233-${Math.floor(1000000000 + Math.random()*9000000000)}`;
        return { lines: [
          "ETK ISSUED OK",
          `TICKET NO : ${tktNum}`,
          `PNR       : ${this.state.locator}`,
          `PAX       : ${this.state.names[0] || "PASSENGER"}`,
          `FARE      : BDT ${this.state.fare ? this.state.fare.total.toLocaleString() : "0"}`,
          "STATUS    : CONFIRMED"
        ]};
      }

      // ── CANCEL SEGMENT: X1 ──
      const xseg = cmd.match(/^X(\d+)$/);
      if (xseg) {
        const segN = parseInt(xseg[1]);
        const idx  = this.state.segments.findIndex(s => s.segNum === segN);
        if (idx === -1) return this.error(`SEGMENT ${segN} NOT FOUND`);
        this.state.segments.splice(idx, 1);
        this.state.priced     = false;
        this.state.storedFare = false;
        return { lines: [`SEGMENT ${segN} CANCELLED`] };
      }

      // ── SSR: SI.SSR MEAL, SI.SSR WCHR, etc. ──
      if (cmd.startsWith("SI.SSR ") || cmd.startsWith("SSR ")) {
        const ssrVal = cmd.startsWith("SI.SSR ") ? cmd.slice(7) : cmd.slice(4);
        this.state.ssr.push(ssrVal);
        return { lines: [`SSR ${ssrVal} ADDED`] };
      }

      // ── OSI ──
      if (cmd.startsWith("SI.OSI ") || cmd.startsWith("OSI ")) {
        const osiVal = cmd.startsWith("SI.OSI ") ? cmd.slice(7) : cmd.slice(4);
        this.state.osk.push(osiVal);
        return { lines: [`OSI ${osiVal} ADDED`] };
      }

      // ── IGNORE: IG ──
      if (cmd === "IG") {
        const signedIn = this.state.signedIn;
        const officeId = this.state.officeId;
        const history = this.state.history;
        this.reset();
        this.state.signedIn = signedIn;
        this.state.officeId = officeId;
        this.state.history = history;
        return { lines: ["IGNORED - CHANGES DISCARDED"] };
      }

      return this.error("UNABLE TO PROCESS - TYPE HELP FOR AVAILABLE COMMANDS");
    }

    // Build full PNR display
    _displayPNR() {
      const s = this.state;
      const lines = [
        `--- RLR ---`,
        `RP/${s.officeId || "DACVS086JJ"}/${s.officeId || "DACVS086JJ"}              ${s.receivedFrom || "TRAINING"}/SU`,
        s.locator,
        ""
      ];
      s.names.forEach(n => lines.push(n));
      s.segments.forEach(seg => {
        lines.push(`${seg.segNum} ${seg.carrier} ${seg.number} ${seg.soldClass || "Y"} ${seg.date} ${seg.origin}${seg.destination} HK${seg.paxCount} ${seg.depart} ${seg.arrive}   #`);
      });
      if (s.ticketing) lines.push(`TL ${s.ticketing}`);
      s.phones.forEach(p => lines.push(`AP ${p}`));
      if (s.receivedFrom) lines.push(`RF-${s.receivedFrom.toUpperCase()}`);
      s.ssr.forEach(r => lines.push(`SSR ${r}`));
      s.osk.forEach(r => lines.push(`OSI ${r}`));
      if (s.storedFare && s.fare) {
        lines.push("");
        lines.push(`TST BDT ${s.fare.total.toLocaleString()}`);
      }
      if (s.issued) lines.push("TKT - ISSUED");
      return { lines };
    }

    _availScreen() {
      const size = GalileoCommandEngine.PAGE_SIZE;
      const start = (this.state.availPage || 0) * size;
      const flights = this.state.results.slice(start, start + size);
      const hasMore = start + size < this.state.results.length;
      const lines = [this.state.availHeader];
      flights.forEach(f => {
        lines.push(GalileoFlights.formatLine(f));
        (f.rows || []).forEach(row => lines.push("  \u00abB\u00bb  " + row));
      });
      if (hasMore) lines.push("\u00abMore Flights\u00bb");
      return {
        lines,
        kind: "avail",
        header: this.state.availHeader,
        flights,
        hasMore
      };
    }

    error(msg) { return { lines: [msg], kind: "error" }; }
  }

  GalileoCommandEngine.PAGE_SIZE = 8;

  global.GalileoCommandEngine = GalileoCommandEngine;
  global.GalileoSteps = STEPS;
}(window));