// ============================================================
//  Gellelio Galileo Training Simulator — App Shell
// ============================================================
const terminal   = document.getElementById("terminal");
const inputEl    = document.getElementById("commandInput");
const formEl     = document.getElementById("commandForm");
const leftMsg    = document.getElementById("leftMessage");
const leftBtns   = document.getElementById("leftButtons");
const leftState  = document.getElementById("leftState");
const leftCommand = document.getElementById("leftCommand");
const leftHint = document.getElementById("leftHint");
const leftRecord = document.getElementById("leftRecord");
const leftRecordDetail = document.getElementById("leftRecordDetail");
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
    const entry = document.createElement("button");
    entry.type = "button";
    entry.className = "history-entry" + (sourceIndex === historyInput.selected ? " selected" : "");
    entry.dataset.historyIndex = String(sourceIndex);
    entry.textContent = command;
    entry.addEventListener("click", function() {
      historyInput.selected = sourceIndex;
      renderHistory();
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

function renderAvailability(resp) {
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
    Object.entries(f.classes || {}).forEach(function(entry) {
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
      line.appendChild(classButton);
      line.appendChild(document.createTextNode(" "));
    });
    line.append(span("gds-eq", parts.equip + " "), span("gds-flag", parts.flag));
    line.addEventListener("click", function() {
      const defaultClass = Object.keys(f.classes || {})[0];
      if (defaultClass) showFlightDetails(f, defaultClass);
    });
    block.appendChild(line);

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
  setLeftPane(["1. " + segment.carrier + " " + segment.number + " " + segment.soldClass + " " + segment.date + " " + segment.origin + segment.destination + " HS1 " + segment.depart + " " + segment.arrive, ""].concat(segment.notes), true);
  update();
  inputEl.focus();
}

function setLeftPane(lines, showButtons) {
  if (leftMsg) leftMsg.textContent = lines.join("\n");
  if (leftBtns) leftBtns.style.display = showButtons ? "flex" : "none";
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

function updateLeftWorkspace() {
  const s = engine.state;
  const command = lastCommand || "READY FOR ENTRY";
  if (leftCommand) leftCommand.textContent = command;
  if (leftState) leftState.textContent = s.signedIn ? "SIGNED IN" : "READY";
  if (leftHint) {
    if (!lastCommand) leftHint.textContent = "Enter a Galileo command in the terminal.";
    else if (s.availability) leftHint.textContent = "Select a class to view details, or enter a sell command.";
    else if (s.segments && s.segments.length) leftHint.textContent = "Continue the PNR or use *ALL to review the booking.";
    else leftHint.textContent = "Command processed. Continue with the next training step.";
  }
  if (!leftRecord || !leftRecordDetail) return;
  const segment = s.segments && s.segments[0];
  if (s.locator) {
    leftRecord.textContent = "PNR " + s.locator;
    leftRecordDetail.textContent = segment ? segment.carrier + segment.number + " " + segment.origin + "-" + segment.destination : "Booking saved and ready to retrieve.";
  } else if (segment) {
    leftRecord.textContent = "UNSAVED ITINERARY";
    leftRecordDetail.textContent = segment.carrier + segment.number + " " + segment.origin + "-" + segment.destination + ". Add passenger details and end transact.";
  } else {
    leftRecord.textContent = "NO ACTIVE PNR";
    leftRecordDetail.textContent = "Create or retrieve a booking to display its details.";
  }
}

function update() {
  const s = engine.state;
  if (statusSpan) statusSpan.textContent = s.signedIn ? "SIGNED IN" : "OFFLINE";
  if (officeSpan) officeSpan.textContent = s.signedIn ? ("OFFICE: " + (s.officeId || "DACVS086JJ")) : "GALILEO TRAINING";
  updateTab();
  updatePNR();
  updateLeftWorkspace();
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
  // A new terminal entry replaces the contextual panel from the previous display.
  if (!isNav) setLeftPane(["NO B.F. TO DISPLAY", "CREATE OR RETRIEVE FIRST"], false);

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

  if (cmd.toUpperCase() === "SOF") {
    engine.state.history = [];
    try { localStorage.removeItem(HISTORY_KEY); } catch (_) {}
  }

  if (resp.segment && resp.leftPaneNotes && resp.leftPaneNotes.length) {
    const seg = resp.segment;
    const hdr = seg.segNum + ". " + seg.carrier + " " + seg.number + " " + seg.soldClass + " " + seg.date + " " + seg.origin + seg.destination + " HS" + seg.paxCount + " " + seg.depart + " " + seg.arrive + " O  " + (resp.lines[0] ? resp.lines[0].slice(-3) : "");
    setLeftPane([hdr, ""].concat(resp.leftPaneNotes), true);
  }

  if (resp.kind === "avail" && resp.flights) {
    renderAvailability(resp);
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
  const btn = e.target.closest(".left-btn, .quick-command");
  if (btn && btn.dataset.cmd) {
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
