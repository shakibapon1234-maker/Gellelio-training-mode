// ============================================================
//  Gellelio Galileo Training Simulator — App Shell
// ============================================================
const terminal   = document.getElementById("terminal");
const inputEl    = document.getElementById("commandInput");
const formEl     = document.getElementById("commandForm");
const leftMsg    = document.getElementById("leftMessage");
const leftBtns   = document.getElementById("leftButtons");
const tabLabel   = document.getElementById("tabLabel");
const locBadge   = document.getElementById("locatorBadge");
const pnrSummary = document.getElementById("pnrSummary");
const statusSpan = document.getElementById("sessionStatus");
const officeSpan = document.getElementById("officeLabel");

const engine = new GalileoCommandEngine();
let histIdx = -1;

function print(text, kind) {
  const pre = document.createElement("pre");
  pre.className = "output" + (kind ? " " + kind : "");
  pre.textContent = text;
  terminal.appendChild(pre);
  terminal.scrollTop = terminal.scrollHeight;
}

function printEcho(cmd) { print(">" + cmd, "echo"); }

function setLeftPane(lines, showButtons) {
  if (leftMsg) leftMsg.textContent = lines.join("\n");
  if (leftBtns) leftBtns.style.display = showButtons ? "flex" : "none";
}

function updateTab() {
  const s = engine.state;
  if (tabLabel) {
    const name = s.names && s.names.length ? s.names[0] : "";
    tabLabel.textContent = name ? "1-" + name.slice(2) : "1->";
  }
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
  mark();
}

function processCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  histIdx = -1;
  printEcho(cmd);

  if (cmd.toUpperCase().startsWith("LESSON ")) {
    const lesson = GalileoLessons.get(cmd.slice(7));
    if (lesson) print(GalileoLessons.format(lesson).join("\n"), "dim");
    else print("LESSON NOT FOUND - USE: BASIC, TICKETING or MODIFICATION", "error");
    update();
    return;
  }

  const resp = engine.process(cmd);

  if (resp.segment && resp.leftPaneNotes && resp.leftPaneNotes.length) {
    const seg = resp.segment;
    const hdr = seg.segNum + ". " + seg.carrier + " " + seg.number + " " + seg.soldClass + " " + seg.date + " " + seg.origin + seg.destination + " HS" + seg.paxCount + " " + seg.depart + " " + seg.arrive + " O  " + (resp.lines[0] ? resp.lines[0].slice(-3) : "");
    setLeftPane([hdr, ""].concat(resp.leftPaneNotes), true);
  }

  if (resp.lines && resp.lines.length) {
    print(resp.lines.join("\n"), resp.kind || "");
  }

  update();
}

formEl.addEventListener("submit", function(e) {
  e.preventDefault();
  processCommand(inputEl.value);
  inputEl.value = "";
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
  const btn = e.target.closest(".left-btn");
  if (!btn) return;
  const cmd = btn.dataset.cmd;
  if (cmd) { processCommand(cmd); inputEl.focus(); }
});

function reset() {
  engine.reset();
  terminal.innerHTML = "";
  setLeftPane(["NO B.F. TO DISPLAY", "CREATE OR RETRIEVE FIRST"], false);
  print("GELLELIO GALILEO TRAINING SIMULATOR\nTRAINING ENVIRONMENT - OFFLINE PRACTICE\n", "");
  print("Sign in: SON/DEMO/DEMO   |   Help: HELP", "dim");
  update();
  inputEl.focus();
}

window.reset = reset;
reset();
