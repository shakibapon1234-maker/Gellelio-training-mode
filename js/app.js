// ============================================================
//  Gellelio Galileo Training Simulator — App Shell
// ============================================================
const terminal   = document.getElementById("terminal");
const inputEl    = document.getElementById("commandInput");
const formEl     = document.getElementById("commandForm");
const leftMsg    = document.getElementById("leftMessage");
const leftBtns   = document.getElementById("leftButtons");
const leftVendorBox = document.getElementById("leftVendorBox");
const leftDetails   = document.getElementById("leftDetails");
const leftSegment = document.getElementById("leftSegment");
const leftPnrHeader = document.getElementById("leftPnrHeader");
const leftPassenger = document.getElementById("leftPassenger");
const leftSegmentHeader = document.getElementById("leftSegmentHeader");
const leftSegmentNotes = document.getElementById("leftSegmentNotes");
const tabLabel   = document.getElementById("tabLabel");
const locBadge   = document.getElementById("locatorBadge");
const pnrSummary = document.getElementById("pnrSummary");
const statusSpan = document.getElementById("sessionStatus");
const officeSpan = document.getElementById("officeLabel");
const tipEl      = document.getElementById("flightTip");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const historyMenu = document.getElementById("historyMenu");
const historyTool = document.getElementById("historyTool");
const brandPanel = document.getElementById("brandPanel");
const historyInput = { selected: -1 };
const HISTORY_KEY = "gellelio-command-history-v1";

const engine = new GalileoCommandEngine();
try {
  const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  if (Array.isArray(stored)) engine.state.history = stored.slice(-100);
} catch (_) {}
let histIdx = -1;
let lastCommand = "";
let activeLeftCommand = "";

function span(cls, text) {
  const el = document.createElement("span");
  el.className = cls;
  el.textContent = text;
  return el;
}

function clearScreen() {
  terminal.innerHTML = "";
  hideTip();
}

function print(text, kind) {
  const pre = document.createElement("pre");
  pre.className = "output" + (kind ? " " + kind : "");
  pre.textContent = text;
  terminal.appendChild(pre);
}

function setScreen(text, kind) {
  clearScreen();
  if (text) print(text, kind);
  terminal.scrollTop = 0;
}

function printEcho(cmd) {
  print(">" + cmd, "echo");
}

function hideTip() {
  if (tipEl) tipEl.hidden = true;
}

function persistHistory() {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify((engine.state.history || []).slice(-100))); } catch (_) {}
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = "";
  const entries = engine.state.history || [];
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = "NO COMMANDS IN HISTORY";
    historyList.appendChild(empty);
    historyInput.selected = -1;
    return;
  }
  entries.slice().reverse().forEach(function(command, displayIndex) {
    const sourceIndex = entries.length - 1 - displayIndex;
    const entry = document.createElement("textarea");
    entry.className = "history-entry" + (sourceIndex === historyInput.selected ? " selected" : "");
    entry.dataset.historyIndex = String(sourceIndex);
    entry.value = command;
    entry.rows = 1;
    entry.spellcheck = false;
    entry.addEventListener("focus", function() {
      historyInput.selected = sourceIndex;
    });
    entry.addEventListener("input", function() {
      engine.state.history[sourceIndex] = entry.value;
      persistHistory();
    });
    historyList.appendChild(entry);
  });
}

function openHistory() {
  renderHistory();
  if (historyPanel) {
    historyPanel.hidden = false;
    historyPanel.removeAttribute("hidden");
  }
}

function closeHistory() {
  if (historyPanel) {
    historyPanel.hidden = true;
    historyPanel.setAttribute("hidden", "");
  }
}

function sendHistorySelection() {
  const command = engine.state.history[historyInput.selected];
  if (!command) return;
  closeHistory();
  processCommand(command);
  inputEl.focus();
}

function deleteHistorySelection() {
  if (historyInput.selected < 0) return;
  engine.state.history.splice(historyInput.selected, 1);
  persistHistory();
  historyInput.selected = -1;
  renderHistory();
}

function closeBrands() { if (brandPanel) brandPanel.hidden = true; }

function openBrands(flight, bookingClass) {
  if (!brandPanel || !flight) return;
  const available = flight.classes && flight.classes[bookingClass];
  const families = [["Promotion International", "Q9  V9  G9  B9"], ["Saver International", "T9  L9  H9"], ["Freedom International", "Y9  M9  K9  N9"], ["Blue Ribbon International", "C9  D9  J9"]];
  document.getElementById("brandSegment").textContent = flight.line + " " + flight.origin + ">" + flight.destination;
  document.getElementById("brandFlight").textContent = flight.date + "  " + flight.origin + " " + flight.depart + " > " + flight.destination + " " + flight.arrive + " / " + flight.carrier + " " + flight.number;
  const familyEl = document.getElementById("brandFamilies");
  familyEl.innerHTML = "";
  families.forEach(function(family, index) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "brand-family" + (index === 2 ? " active" : "");
    item.innerHTML = "<b>" + family[0] + "</b><span>" + family[1] + "</span>";
    familyEl.appendChild(item);
  });
  document.getElementById("brandHero").innerHTML = "<div class='brand-logo'>" + flight.carrier + "</div><div><b>" + flight.carrier + " " + flight.number + "</b><span>" + flight.date + "<br>" + flight.origin + " " + flight.depart + "  >  " + flight.destination + " " + flight.arrive + "</span></div>";
  document.getElementById("brandDescription").innerHTML = "<h3>Currently viewing " + bookingClass + " Class</h3><p><b>" + (available === "C" ? "Waitlist only" : available + " seats available") + "</b></p><p>Economy fare brand for " + (flight.airline_full || "the operating carrier") + ". Confirm fare rules and ticketing conditions before selling.</p><ul><li>Cabin baggage allowance included</li><li>Seat selection subject to availability</li><li>Changes and refund rules vary by fare</li><li>Meals and special services by carrier policy</li></ul>";
  const items = [["▣", "Baggage Allowance", "Included"], ["▰", "Hand-carry Allowance", "Included"], ["◆", "CHANGE FEE", "Varies based on flight"], ["!", "Rebooking", "Varies based on flight"], ["▾", "Pre Reserved Seat", "Available"], ["♨", "Inflight Meal", "Carrier policy"]];
  document.getElementById("brandAncillaries").innerHTML = items.map(function(item) { return "<div class='ancillary'><i>" + item[0] + "</i><b>" + item[1] + "</b><span>" + item[2] + "</span></div>"; }).join("");
  brandPanel.hidden = false;
}

if (historyMenu) historyMenu.addEventListener("click", openHistory);
if (historyTool) historyTool.addEventListener("click", openHistory);
document.getElementById("brandClose")?.addEventListener("click", closeBrands);
document.getElementById("brandCloseFooter")?.addEventListener("click", closeBrands);
if (historyPanel) historyPanel.addEventListener("click", function(e) {
  if (e.target === historyPanel) closeHistory();
});
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && historyPanel && !historyPanel.hidden) closeHistory();
  if (e.key === "Escape" && brandPanel && !brandPanel.hidden) closeBrands();
});

function showTip(text, x, y) {
  if (!tipEl || !text) return;
  tipEl.textContent = text;
  tipEl.hidden = false;
  const wrap = tipEl.parentElement.getBoundingClientRect();
  const left = Math.min(Math.max(8, x - wrap.left + 12), wrap.width - 200);
  const top  = Math.min(Math.max(40, y - wrap.top + 12), wrap.height - 80);
  tipEl.style.left = left + "px";
  tipEl.style.top  = top + "px";
}

function showFlightDetails(flight, bookingClass) {
  if (!flight || !leftMsg) return;
  const availability = flight.classes && flight.classes[bookingClass];
  const seatStatus = availability === "C" ? "CLOSED / WAITLIST" :
    (availability === 0 ? "WAITLIST ONLY" : availability + " SEATS AVAILABLE");
  const notes = (flight.notes && flight.notes.length) ? flight.notes : [
    "CHECK FARE RULES, BAGGAGE AND TICKET TIME LIMIT BEFORE SELLING.",
    "USE N" + flight.line + bookingClass + "1 TO SELL ONE SEAT IN THIS CLASS."
  ];
  const detailLines = [
    "FLIGHT / CLASS DETAILS",
    "",
    flight.line + ". " + flight.carrier + " " + flight.number + "  " + (flight.airline_full || "OPERATING CARRIER"),
    "BOOKING CLASS " + bookingClass + "  " + seatStatus,
    "",
    "DATE       " + flight.date + "   OPERATING " + (flight.freq || "DAILY"),
    "ROUTE      " + flight.origin + "  -  " + flight.destination,
    "DEPARTS    " + flight.depart + "  TERMINAL " + (flight.termOrig || "1"),
    "ARRIVES    " + flight.arrive + "  TERMINAL " + (flight.termDest || "1"),
    "AIRCRAFT   " + (flight.equip || "SEE CARRIER"),
    "STATUS     CONFIRM ON AVAILABILITY",
    "",
    "TRAVEL INFORMATION",
    "------------------"
  ].concat(notes).concat([
    "",
    "COMMAND: N" + flight.line + bookingClass + "1  (SELL 1 SEAT)",
    "CLICK ANOTHER CLASS TO VIEW ITS DETAILS"
  ]);
  setLeftPane(detailLines, true);
}

function renderAvailability(resp, commandEcho) {
  clearScreen();
  const header = document.createElement("pre");
  header.className = "output avail-header";
  header.textContent = resp.header || "";
  terminal.appendChild(header);

  (resp.flights || []).forEach(function(f) {
    const parts = GalileoFlights.formatParts(f);
    const block = document.createElement("div");
    block.className = "avail-block";
    block.dataset.notes = (f.notes || []).join("\n");

    const line = document.createElement("div");
    line.className = "avail-line";
    line.append(
      span("gds-ln", parts.ln + " "),
      span("gds-city", parts.orig + " "),
      span("gds-city", parts.dest + " "),
      span("gds-time", parts.depart + " " + parts.arrive + "  "),
      span("gds-al", parts.carrier + " "),
      span("gds-fn", parts.number + "  ")
    );
    const classEntries = Object.entries(f.classes || {});
    function appendClass(entry, target) {
      const bookingClass = entry[0];
      const availability = entry[1];
      const classButton = document.createElement("button");
      classButton.type = "button";
      classButton.className = "gds-cls" + (availability === "C" || availability === 0 ? " closed" : "");
      classButton.textContent = bookingClass + availability;
      classButton.title = "Show " + bookingClass + " class details";
      classButton.addEventListener("click", function(e) {
        e.stopPropagation();
        terminal.querySelectorAll(".gds-cls.selected").forEach(function(el) { el.classList.remove("selected"); });
        classButton.classList.add("selected");
        showFlightDetails(f, bookingClass);
        openBrands(f, bookingClass);
      });
      target.appendChild(classButton);
      target.appendChild(document.createTextNode(" "));
    }
    classEntries.slice(0, 14).forEach(function(entry) { appendClass(entry, line); });
    line.append(span("gds-eq", parts.equip + " "), span("gds-flag", parts.flag));
    line.addEventListener("click", function() {
      const defaultClass = Object.keys(f.classes || {})[0];
      if (defaultClass) showFlightDetails(f, defaultClass);
    });
    block.appendChild(line);

    const remainingClasses = classEntries.slice(14);
    if (remainingClasses.length) {
      const classLine = document.createElement("div");
      classLine.className = "avail-line class-continuation";
      classLine.appendChild(document.createTextNode("     "));
      remainingClasses.forEach(function(entry) { appendClass(entry, classLine); });
      block.appendChild(classLine);
    }

    (f.rows || []).forEach(function(row) {
      const r2 = document.createElement("div");
      r2.className = "avail-line";
      const b = document.createElement("button");
      b.type = "button";
      b.className = "gds-b";
      b.textContent = "\u00abB\u00bb";
      r2.appendChild(b);
      r2.appendChild(span("gds-row2", "  " + row));
      block.appendChild(r2);
    });
    if (!(f.rows && f.rows.length)) {
      const bLine = document.createElement("div");
      bLine.className = "avail-line";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gds-b";
      btn.textContent = "\u00abB\u00bb";
      bLine.appendChild(btn);
      block.appendChild(bLine);
    }

    terminal.appendChild(block);
  });

  if (resp.hasMore !== false) {
    const moreWrap = document.createElement("div");
    moreWrap.className = "avail-line";
    const more = document.createElement("button");
    more.type = "button";
    more.className = "gds-more";
    more.textContent = "\u00abMore Flights\u00bb";
    more.addEventListener("click", function() { processCommand("MD"); });
    moreWrap.appendChild(more);
    terminal.appendChild(moreWrap);
  }

  if (commandEcho) print(">" + commandEcho.toUpperCase(), "");

  terminal.scrollTop = 0;
}

function renderFare(resp) {
  clearScreen();
  const output = document.createElement("div");
  output.className = "fare-output";
  let fareOptionIndex = -1;
  (resp.lines || []).forEach(function(line) {
    const row = document.createElement("div");
    row.className = "fare-row";
    if (/^PRICING OPTION/.test(line)) { row.classList.add("fare-label"); fareOptionIndex++; }
    if (/^ADT|^TTL OF/.test(line)) row.classList.add("fare-label");
    if (/TOTAL AMOUNT/.test(line)) row.classList.add("fare-total");
    if (/^\d+\s/.test(line)) row.classList.add("fare-flight");
    if (/^«BOOK»/.test(line)) row.classList.add("fare-book");
    if (/D  R/.test(line)) row.classList.add("fare-actions");
    if (/TOTAL AMOUNT/.test(line)) {
      const parts = line.split("TOTAL AMOUNT");
      row.appendChild(document.createTextNode(parts[0] + "TOTAL AMOUNT"));
      const total = document.createElement("span");
      total.className = "fare-total-value";
      total.textContent = parts[1].trim();
      row.appendChild(total);
    } else if (/^«BOOK»/.test(line)) {
      const book = document.createElement("button");
      book.type = "button";
      book.className = "fare-book-button";
      book.textContent = line;
      const selectedOption = fareOptionIndex;
      book.addEventListener("click", function() { bookFareShopOption(selectedOption); });
      row.appendChild(book);
    } else {
      row.textContent = line || " ";
    }
    output.appendChild(row);
  });
  terminal.appendChild(output);
  terminal.scrollTop = 0;
}

function bookFareShopOption(index) {
  const option = engine.state.fare && engine.state.fare.options && engine.state.fare.options[index];
  if (!option) return;
  const segment = {
    segNum: 1, carrier: option.carrier.replace("#", ""), number: option.number,
    soldClass: option.cls, date: option.date, origin: option.origin, destination: option.destination,
    depart: option.depart, arrive: option.arrive, termOrig: "1", termDest: "1", paxCount: 1, status: "HS",
    notes: ["DEPARTS " + option.origin + " TERMINAL 1 - ARRIVES " + option.destination + " TERMINAL 1", "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS", "PERSONAL DATA MAY BE PASSED TO GOVERNMENT AUTHORITIES FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES"]
  };
  engine.state.segments = [segment];
  engine.state.priced = true;
  const sold = [
    "************************ SOLD SEGMENTS ************************",
    " 1. " + segment.carrier + "  " + segment.number + " " + segment.soldClass + " " + segment.date + " " + segment.origin + segment.destination + " " + segment.status + " " + segment.depart + " " + segment.arrive + "       E",
    "DEPARTS " + segment.origin + " TERMINAL 1",
    "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
    "PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
    "WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
    "FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES", "",
    "************************* FILED FARE *************************",
    "FARE OPTION " + (index + 1) + " SELECTED - TOTAL BDT " + (option.partyTotal || option.total),
    "NO PLATING CARRIER FOUND"
  ];
  setScreen(sold.join("\n"));
  renderLeftSegment(segment, segment.notes);
  update();
  inputEl.focus();
}

function setLeftPane(lines, showButtons) {
  if (leftMsg) {
    leftMsg.textContent = lines.join("\n");
    leftMsg.hidden = !lines.length;
  }
  if (leftSegment) leftSegment.hidden = true;
  if (leftPassenger) leftPassenger.hidden = true;
  if (leftPnrHeader) leftPnrHeader.hidden = true;
  if (leftVendorBox) leftVendorBox.hidden = true;
  if (leftDetails) { leftDetails.innerHTML = ""; leftDetails.hidden = true; }
  if (leftBtns) leftBtns.style.display = "none";
}

function formatArriveTime(depart, arrive) {
  if (!arrive) return "";
  const arr = String(arrive).trim();
  if (arr.startsWith("#") || arr.startsWith("+") || arr.startsWith("-")) return arr;
  const depNum = parseInt(String(depart || "").replace(/\D/g, ""), 10);
  const arrNum = parseInt(arr.replace(/\D/g, ""), 10);
  if (!isNaN(depNum) && !isNaN(arrNum) && arrNum < depNum) {
    return "#" + arr;
  }
  return arr;
}

function getSegmentDayCode(dateStr, depart, arrive) {
  if (!dateStr) return "";
  const MONTHS = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
  const DAYS_2 = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const m = String(dateStr).trim().toUpperCase().match(/^(\d{1,2})([A-Z]{3})(\d{2})?$/);
  if (!m) return "";
  const d = parseInt(m[1], 10);
  const mon = MONTHS[m[2]];
  if (mon === undefined) return "";
  const yr = m[3] ? 2000 + parseInt(m[3], 10) : 2026;
  const dt = new Date(yr, mon, d);
  const depDayIdx = dt.getDay();
  const depDay = DAYS_2[depDayIdx];

  let offset = 0;
  const arrStr = String(arrive || "").trim();
  if (arrStr.startsWith("#") || arrStr.startsWith("+1")) offset = 1;
  else if (arrStr.startsWith("+2")) offset = 2;
  else if (arrStr.startsWith("-1") || arrStr.startsWith("-")) offset = -1;
  else {
    const depNum = parseInt(String(depart || "").replace(/\D/g, ""), 10);
    const arrNum = parseInt(arrStr.replace(/\D/g, ""), 10);
    if (!isNaN(depNum) && !isNaN(arrNum) && arrNum < depNum) offset = 1;
  }

  const arrDayIdx = (depDayIdx + offset + 7) % 7;
  const arrDay = DAYS_2[arrDayIdx];
  if (offset !== 0 || depDay !== arrDay) {
    return depDay + "/" + arrDay;
  }
  return depDay;
}

function refreshLeftPnrHeader() {
  if (!leftPnrHeader) return;
  const s = engine.state;
  if (s.segments && s.segments.length) {
    if (!s.locator) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let loc = "";
      for (let i = 0; i < 6; i++) loc += chars[Math.floor(Math.random() * chars.length)];
      s.locator = loc;
    }
    const month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const now = new Date();
    const stamp = String(now.getDate()).padStart(2, "0") + month[now.getMonth()];
    const office = (s.officeId || "DACVS086JJ").replace(/^DAC(VS0)?/i, "") || "86JJ";
    const officeStr = office.includes("MR") ? office : (office + "MR");
    leftPnrHeader.textContent = s.locator + "/MR DACOU " + officeStr + " AG 42341084 " + stamp;
    leftPnrHeader.hidden = false;
  } else {
    leftPnrHeader.textContent = "";
    leftPnrHeader.hidden = true;
  }
}

function refreshLeftPassenger() {
  if (!leftPassenger) return;
  const name = engine.state.names && engine.state.names[0];
  leftPassenger.textContent = name ? name.replace(/^(\d+)-/, "$1.1") : "";
  leftPassenger.hidden = !name;
}

function renderLeftSegment(seg, notes, hideNotes) {
  if (!seg || !leftSegment || !leftSegmentHeader || !leftSegmentNotes) return;
  const isConfirmed = seg.status === "HK" || engine.state.saved || !!engine.state.receivedFrom;
  const status = (isConfirmed ? "HK" : (seg.status || "HS")) + (seg.paxCount || 1);
  const stopInd = isConfirmed ? "0*" : "0";
  const arriveStr = formatArriveTime(seg.depart, seg.arrive);
  const dayCode = getSegmentDayCode(seg.date, seg.depart, arriveStr);
  leftSegmentHeader.innerHTML =
    '<span class="segment-number">' + seg.segNum + '.</span> ' +
    '<span class="segment-airline">' + seg.carrier + '</span>  ' + seg.number + ' ' +
    '<span class="segment-class">' + seg.soldClass + '</span> ' +
    seg.date + ' <span class="segment-airline">' + seg.origin + seg.destination + '</span> ' +
    status + '  ' + seg.depart + ' ' + arriveStr + ' ' + stopInd +
    (dayCode ? ('              ' + dayCode) : '');
  leftSegmentNotes.classList.remove("pnr-details");

  const termOrig = seg.termOrig || "1";
  const termDest = (seg.destination === "SIN") ? "3" : (seg.termDest || "3");
  const departsLine = "DEPARTS " + seg.origin + " TERMINAL " + termOrig + "  - ARRIVES " + seg.destination + " TERMINAL " + termDest;
  const apisLine = "*APIS PAX DATA REQUIRED SSR DOCS*";

  let lines = [departsLine, apisLine];
  if (notes && notes.length) {
    notes.forEach(function(line) {
      if (!line.startsWith("DEPARTS") && !line.includes("APIS PAX DATA REQUIRED")) {
        lines.push(line);
      }
    });
  }
  if (!lines.some(function(l) { return l.includes("ADD ADVANCE PASSENGER"); })) {
    lines.push("ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS");
  }
  if (!lines.some(function(l) { return l.includes("PERSONAL DATA"); })) {
    lines.push("PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION");
    lines.push("WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES");
    lines.push("FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES");
  }

  leftSegmentNotes.textContent = lines.join("\n");
  if (leftMsg) leftMsg.hidden = true;
  const hasName = !!(engine.state.names && engine.state.names.length);
  leftSegmentNotes.hidden = hideNotes !== undefined ? !!hideNotes : hasName;
  leftSegment.hidden = false;
  if (leftBtns) leftBtns.style.display = "flex";
}

function refreshLeftVendorBox() {
  if (!leftVendorBox) return;
  const s = engine.state;
  if (!s.segments || !s.segments.length) {
    leftVendorBox.hidden = true;
    return;
  }
  const lines = [];
  if (s.filedFare) {
    lines.push('<div class="vendor-exists-line">** FILED FARE DATA EXISTS **  <span class="cmd-link" data-cmd="*FF">&gt;*FF</span></div>');
  }
  if (s.vendorLocator || s.receivedFrom || s.saved) {
    lines.push('<div class="vendor-exists-line">** VENDOR LOCATOR DATA EXISTS **  <span class="cmd-link" data-cmd="*VL">&gt;*VL</span></div>');
    lines.push('<div class="vendor-exists-line">** VENDOR REMARKS DATA EXISTS **  <span class="cmd-link" data-cmd="*VR">&gt;*VR</span></div>');
  }
  if (s.ssr && s.ssr.length) {
    lines.push('<div class="vendor-exists-line">** SERVICE INFORMATION EXISTS **  <span class="cmd-link" data-cmd="*SI">&gt;*SI</span></div>');
  }
  if (lines.length) {
    const notifContainer = document.getElementById("vendorNotifications") || leftVendorBox;
    notifContainer.innerHTML = lines.join("");
    leftVendorBox.hidden = false;
  } else {
    leftVendorBox.hidden = true;
  }
}

function refreshLeftButtons() {
  if (!leftBtns) return;
  const s = engine.state;
  if (!s.segments || !s.segments.length) {
    leftBtns.style.display = "none";
    return;
  }
  const commands = ["*ALL"];
  if (s.phones && s.phones.length) commands.push("*P");
  if (s.ticketing) commands.push("*TD");
  if (s.filedFare) commands.push("*FF");
  if (s.vendorLocator || s.receivedFrom || s.saved) {
    commands.push("*VL");
    commands.push("*VR");
  }
  if (s.ssr && s.ssr.length) commands.push("*SI");
  if (!s.filedFare) commands.push("*RV");

  leftBtns.innerHTML = commands.map(function(command) {
    return '<button class="left-btn' + (command === activeLeftCommand ? ' selected' : '') + '" data-cmd="' + command + '">' + command + '</button>';
  }).join("");
  leftBtns.style.display = "flex";
}

function renderCancelledPNR() {
  const s = engine.state;
  setLeftPane([
    "PNR INUSE - IGNORE AND RERETRIEVE",
    "1-" + ((s.names && s.names[0]) ? s.names[0].replace(/^1-/, "") : "PASSENGER"),
    "",
    "** VENDOR LOCATOR DATA EXISTS **  >*VL",
    "** VENDOR REMARKS DATA EXISTS **  >*VR"
  ], true);
}

function renderLeftPNRDisplay(display) {
  const s = engine.state;
  const seg = s.segments && s.segments[0];
  if (!leftDetails) return;

  const paxName = (s.names && s.names[0]) ? s.names[0].replace(/^\d+-/, "") : "PASSENGER";
  const pax1Formatted = "-1" + paxName;

  const phone = s.phones && s.phones[0] ? "FONE-CGPT* " + s.phones[0].toUpperCase() : "NO PHONE FIELD IN PNR";
  const ticketing = s.ticketing ? "TKTG-" + s.ticketing : "NO TICKETING FIELD IN PNR";
  const vendorLocator = ["VENDOR LOCATOR", "VLOC-" + (s.vendorLocator || "NOT AVAILABLE")];
  const vendorRemarks = ["VENDOR REMARKS", s.vendorRemarks || "NO VENDOR REMARKS IN PNR"];

  let serviceLines = ["*** SPECIAL SERVICE REQUIREMENT ***", "SEGMENT/PASSENGER RELATED", "*** MANUAL SSR DATA ***"];
  if (s.ssr && s.ssr.length) {
    s.ssr.forEach(function(item, idx) {
      const num = idx + 1;
      let lineText = "";
      const rawText = (typeof item === "object" && item.raw) ? item.raw : String(item);
      if (rawText.includes("DOCS")) {
        // e.g. SI.P1/SSRDOCSBSHK1/P/BGD/A92766286/BGD/20MAY95/M/20MAY30/KHAN/MD IMRAN
        const afterDocs = rawText.replace(/^.*?DOCS/i, "");
        const match = afterDocs.match(/^([A-Z]{2})?(?:HK\d*)?\/(.*)/i);
        const carrier = (match && match[1]) || (seg ? seg.carrier : "BS");
        const details = (match && match[2]) || afterDocs.replace(/^.*?\//, "");
        lineText = "  <span class=\"highlight-green\">M " + num + ".</span> SSRDOCS" + carrier + " HK   " + details + " " + pax1Formatted;
      } else if (rawText.includes("CTCE")) {
        const afterCtce = rawText.replace(/^.*?CTCE/i, "");
        const match = afterCtce.match(/^([A-Z]{2})?(?:HK\d*)?\/(.*)/i);
        const carrier = (match && match[1]) || (seg ? seg.carrier : "BS");
        const email = (match && match[2]) || afterCtce.replace(/^.*?\//, "");
        lineText = "  <span class=\"highlight-green\">M " + num + ".</span> SSRCTCE" + carrier + " HK  /" + email + "-" + paxName;
      } else if (rawText.includes("CTCM")) {
        const afterCtcm = rawText.replace(/^.*?CTCM/i, "");
        const match = afterCtcm.match(/^([A-Z]{2})?(?:HK\d*)?\/(.*)/i);
        const carrier = (match && match[1]) || (seg ? seg.carrier : "BS");
        const phoneNum = (match && match[2]) || afterCtcm.replace(/^.*?\//, "");
        lineText = "  <span class=\"highlight-green\">M " + num + ".</span> SSRCTCM" + carrier + " HK  /" + phoneNum + "-" + paxName;
      } else {
        lineText = "  <span class=\"highlight-green\">M " + num + ".</span> SSR-" + rawText + " " + pax1Formatted;
      }
      serviceLines.push(lineText);
    });
  } else {
    serviceLines.push("NO SSR DATA IN PNR");
  }
  serviceLines.push("NO OSI EXISTS");

  const filedFare = s.fare ? ["FILED FARE", "FQG 1        BDT " + s.fare.total.toLocaleString(), "GRAND TOTAL INCLUDING TAXES     BDT " + s.fare.total.toLocaleString(), "E-TKT REQUIRED", "BAGGAGE ALLOWANCE", "ADT  " + (seg ? seg.carrier + " " + seg.origin + seg.destination + "  2PC" : "2PC")] : ["NO FILED FARE DATA IN PNR"];

  const displays = {
    all: [phone, ticketing, "", ...vendorLocator, "", ...vendorRemarks, "", ...serviceLines, ...(s.filedFare ? ["", ...filedFare] : [])],
    phone: [phone],
    ticketing: [ticketing],
    vendorLocator: vendorLocator,
    vendorRemarks: vendorRemarks,
    service: serviceLines,
    filedFare: filedFare
  };

  const contentLines = displays[display] || [];
  if (contentLines.length) {
    leftDetails.innerHTML = contentLines.join("\n");
    leftDetails.hidden = false;
  } else {
    leftDetails.innerHTML = "";
    leftDetails.hidden = true;
  }
}

function updateTab() {
  if (!tabLabel) return;
  tabLabel.textContent = lastCommand ? ("1-" + lastCommand) : "1->";
}

function mark() {
  const s = engine.state;
  const done = {
    login:        s.signedIn,
    availability: s.availability,
    sell:         s.segments && s.segments.length > 0,
    name:         s.names    && s.names.length > 0,
    contact:      s.phones   && s.phones.length > 0,
    save:         s.saved,
    price:        s.priced,
    issue:        s.issued
  };
  GalileoSteps.forEach(function(step) {
    const el = document.querySelector("[data-step=\"" + step + "\"]");
    if (el) el.classList.toggle("done", !!done[step]);
  });
}

function updatePNR() {
  const s = engine.state;
  if (locBadge) locBadge.textContent = s.locator || "---";
  if (!pnrSummary) return;
  if (!s.locator && (!s.segments || !s.segments.length) && (!s.names || !s.names.length)) {
    pnrSummary.textContent = "No active booking";
    pnrSummary.className = "empty";
    return;
  }
  const seg  = s.segments && s.segments[0];
  const name = s.names    && s.names[0];
  pnrSummary.className = "";
  pnrSummary.innerHTML =
    "<b>" + (s.locator || "UNSAVED") + "</b><br>" +
    (name || "No passenger") + "<br>" +
    (seg ? seg.carrier + seg.number + " " + seg.origin + "-" + seg.destination : "No segment") + "<br>" +
    (s.priced ? "FARE QUOTED" : "Not priced") +
    (s.issued ? "<br><b class='issued'>TICKET ISSUED</b>" : "");
}

function update() {
  const s = engine.state;
  if (statusSpan) statusSpan.textContent = s.signedIn ? "SIGNED IN" : "OFFLINE";
  if (officeSpan) officeSpan.textContent = s.signedIn ? ("OFFICE: " + (s.officeId || "DACVS086JJ")) : "GALILEO TRAINING";
  updateTab();
  updatePNR();
  refreshLeftButtons();
  refreshLeftVendorBox();
  refreshLeftPnrHeader();
  refreshLeftPassenger();
  mark();
  persistHistory();
}

function processCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  histIdx = -1;
  const nav = cmd.toUpperCase();
  const isNav = nav === "MD" || nav === "MU" || nav === "MT" || nav === "MB";
  if (!isNav) lastCommand = cmd.toUpperCase();
  if (!isNav && !engine.state.segments.length) { if (leftMsg) leftMsg.hidden = true; if (leftSegment) leftSegment.hidden = true; if (leftBtns) leftBtns.style.display = "none"; }

  if (cmd.toUpperCase().startsWith("LESSON ")) {
    const lesson = GalileoLessons.get(cmd.slice(7));
    if (lesson) setScreen(GalileoLessons.format(lesson).join("\n"), "dim");
    else setScreen("LESSON NOT FOUND - USE: BASIC, TICKETING or MODIFICATION", "error");
    update();
    return;
  }

  const navCmd = cmd.toUpperCase();
  if (navCmd === "MD" || navCmd === "MU" || navCmd === "MT" || navCmd === "MB") {
    const paged = engine.process(navCmd);
    if (paged && paged.kind === "avail" && paged.flights) renderAvailability(paged);
    else if (paged && paged.lines && paged.lines.length) setScreen(paged.lines.join("\n"), paged.kind || "");
    update();
    return;
  }

  const resp = engine.process(cmd);

  // A fresh availability, or Ignore, must not leave an old fare-detail panel open.
  if (/^A\d{2}[A-Z]{3}/i.test(cmd) || /^(I|IG)$/i.test(cmd)) closeBrands();

  if (resp.clearTerminal) clearScreen();
  if (resp.leftDisplay && resp.leftDisplay !== "overview") renderLeftPNRDisplay(resp.leftDisplay);
    if (resp.kind === "end" || (resp.leftDisplay === "overview") || cmd.toUpperCase() === "IR" || cmd.toUpperCase() === "*RV") {
    activeLeftCommand = null;
    if (leftDetails) {
      leftDetails.innerHTML = "";
      leftDetails.hidden = true;
    }
    if (leftSegmentNotes) {
      leftSegmentNotes.classList.remove("pnr-details");
      leftSegmentNotes.textContent = "";
      leftSegmentNotes.hidden = true;
    }
    const seg = engine.state.segments && engine.state.segments[0];
    if (seg) renderLeftSegment(seg, [], true);
  }
  if (resp.kind === "cancel") renderCancelledPNR();

  if (cmd.toUpperCase() === "SOF") {
    engine.state.history = [];
    try { localStorage.removeItem(HISTORY_KEY); } catch (_) {}
  }

  if (resp.segment) {
    const seg = resp.segment;
    renderLeftSegment(seg, resp.leftPaneNotes);
  }
  if (resp.kind === "name" && leftSegmentNotes) leftSegmentNotes.hidden = true;

  if (resp.kind === "ignore") {
    if (engine.state.segments && engine.state.segments.length) {
      const seg = engine.state.segments[0];
      renderLeftSegment(seg, seg.notes || []);
      if (leftSegmentNotes) leftSegmentNotes.hidden = false;
    } else {
      setLeftPane(["NO B.F. TO DISPLAY", "CREATE OR RETRIEVE FIRST"], false);
    }
  }

  if (resp.kind === "avail" && resp.flights) {
    renderAvailability(resp);
  } else if ((resp.kind === "sell" || resp.kind === "name") && engine.state.availability && engine.state.results.length) {
    // Smartpoint keeps the current availability display on screen after a sell.
    // The new segment is shown in the left work area instead of replacing flights.
    renderAvailability(engine._availScreen());
  } else if (/^(P\.(?:T|P)\*|9\/|T\.T\*|T-|R\.|RF-)/i.test(cmd) && engine.state.availability && engine.state.results.length) {
    // Smartpoint retains the active availability display while PNR fields are added.
    renderAvailability(engine._availScreen(), cmd);
  } else if (resp.kind === "fare") {
    renderFare(resp);
  } else if (resp.lines && resp.lines.length) {
    setScreen(resp.lines.join("\n"), resp.kind || "");
  }

  update();
}

formEl.addEventListener("submit", function(e) {
  e.preventDefault();
  processCommand(inputEl.value);
  inputEl.value = "";
  inputEl.focus();
});

inputEl.addEventListener("keydown", function(e) {
  const hist = engine.state.history;
  if (!hist.length) return;
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (histIdx < hist.length - 1) histIdx++;
    inputEl.value = hist[hist.length - 1 - histIdx] || "";
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (histIdx > 0) { histIdx--; inputEl.value = hist[hist.length - 1 - histIdx] || ""; }
    else             { histIdx = -1; inputEl.value = ""; }
  }
});

document.addEventListener("click", function(e) {
  if (e.target.closest("#historyMenu")) {
    openHistory();
    return;
  }
  if (e.target.closest("#historyClose")) {
    closeHistory();
    return;
  }
  if (e.target.closest("#historySend")) {
    sendHistorySelection();
    return;
  }
  if (e.target.closest("#historyDelete")) {
    deleteHistorySelection();
    return;
  }
  if (e.target.closest("#historyOptions")) {
    return;
  }
  if (historyPanel && e.target === historyPanel) {
    closeHistory();
    return;
  }
  const btn = e.target.closest(".left-btn, [data-cmd]");
  if (btn && btn.dataset.cmd) {
    activeLeftCommand = btn.dataset.cmd;
    processCommand(btn.dataset.cmd);
    inputEl.focus();
    return;
  }
  if (e.target.closest(".prompt-gt") || e.target.closest(".terminal-wrap")) {
    if (!e.target.closest("button")) inputEl.focus();
  }
});

terminal.addEventListener("mousemove", function(e) {
  const block = e.target.closest(".avail-block");
  if (!block) { hideTip(); return; }
  showTip(block.dataset.notes || "", e.clientX, e.clientY);
});
terminal.addEventListener("mouseleave", hideTip);

function reset() {
  const preservedHistory = engine.state.history || [];
  engine.reset();
  engine.state.history = preservedHistory;
  historyInput.selected = -1;
  lastCommand = "";
  setLeftPane(["NO B.F. TO DISPLAY", "CREATE OR RETRIEVE FIRST"], false);
  setScreen("GELLELIO GALILEO TRAINING SIMULATOR\nTRAINING ENVIRONMENT - OFFLINE PRACTICE\n\nSign in: SON/DEMO/DEMO   |   Help: HELP\nType at the > prompt above. Scroll or MD/MU to move the display.");
  update();
  inputEl.focus();
}

window.reset = reset;
reset();

// ============================================================
//  TEMPORARY ONE-CLICK LOGIN BYPASS
//  REMOVE THIS BLOCK BEFORE FINAL PROJECT SUBMISSION
// ============================================================
(function autoLogin() {
  if (engine.state.signedIn) return;
  engine.state.signedIn = true;
  engine.state.officeId = "DACVS086JJ";
  engine.state.signOn = "DEMO";
  setScreen("SIGN IN COMPLETE\nOFFICE ID  : DACVS086JJ\nDUTY CODE  : SU\nTRAINING   : GELLELIO GALILEO PRACTICE SIMULATOR");
  update();
  inputEl.focus();
})();
