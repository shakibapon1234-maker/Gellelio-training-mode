const terminal = document.getElementById("terminal");
const input = document.getElementById("commandInput");
const form = document.getElementById("commandForm");
const state = { signedIn:false, availability:false, segment:null, name:null, phone:null, ticketing:null, locator:null, priced:false, storedFare:false, issued:false, saved:false, lesson:"basic" };
const steps = ["login","availability","sell","name","contact","save","price","issue"];
const clone = value => JSON.parse(JSON.stringify(value));
const flights = [
  {line:1, carrier:"BG", number:"147", cls:"Y", date:"01APR", origin:"MUX", destination:"JED", depart:"1420", arrive:"1745", seats:9},
  {line:2, carrier:"SV", number:"809", cls:"Y", date:"01APR", origin:"MUX", destination:"JED", depart:"1910", arrive:"2205", seats:4},
  {line:3, carrier:"EK", number:"585", cls:"Y", date:"01APR", origin:"DAC", destination:"DXB", depart:"1025", arrive:"1315", seats:7}
];
function print(text, kind=""){ const el=document.createElement("pre"); el.className=`output ${kind}`; el.textContent=text; terminal.appendChild(el); terminal.scrollTop=terminal.scrollHeight; }
function promptEcho(command){ print(`*${command}`,"dim"); }
function reset(){ Object.assign(state,{signedIn:false,availability:false,segment:null,name:null,phone:null,ticketing:null,locator:null,priced:false,storedFare:false,issued:false,saved:false}); terminal.innerHTML=""; print("GELLELIO GALILEO TRAINING SIMULATOR\nTRAINING ENVIRONMENT - OFFLINE PRACTICE"); print("Type SON/DEMO/DEMO to sign in. Type HELP for available commands.","dim"); update(); input.focus(); }
function mark(){ steps.forEach(step=>{const el=document.querySelector(`[data-step="${step}"]`); const complete={login:state.signedIn,availability:state.availability,sell:!!state.segment,name:!!state.name,contact:!!state.phone,save:state.saved,price:state.priced,issue:state.issued}[step]; el.classList.toggle("done",complete);}); }
function update(){ document.getElementById("sessionStatus").textContent=state.signedIn?"SIGNED IN":"OFFLINE"; document.getElementById("officeLabel").textContent=state.signedIn?"OFFICE: DACVS01":"OFFICE: --"; document.getElementById("locatorBadge").textContent=state.locator||"---"; const summary=document.getElementById("pnrSummary"); summary.innerHTML=state.locator?`<b>${state.locator}</b><br>${state.name||"Passenger not added"}<br>${state.segment?`${state.segment.carrier}${state.segment.number} ${state.segment.origin}-${state.segment.destination}`:"No segment"}<br>${state.priced?"FARE QUOTED":"Not priced"}${state.issued?"<br><b class='issued'>TICKET ISSUED</b>":""}`:"No active booking"; mark(); }
function availability(){ state.availability=true; print("  GALILEO AVAILABILITY - 01APR - MUX/JED\n  1 BG 147 Y9  MUX JED 1420 1745  01APR\n  2 SV 809 Y4  MUX JED 1910 2205  01APR\n  3 EK 585 Y7  DAC DXB 1025 1315  01APR\n  > SELL FORMAT: N1Y1"); }
function process(raw){ const command=raw.trim().toUpperCase(); if(!command)return; promptEcho(raw); if(command==="HELP"||command==="GG HELP"){print("CORE TRAINING COMMANDS\nSON/AGENCY/PASSWORD  Sign in\nA01APRMUXJED         Display availability\nN1Y1                 Sell line 1, Y class, 1 passenger\nN/DOE/JOHN MR        Add passenger name\n9/8801712345678      Add contact\nT-01APR              Add ticketing time limit\nRF-JOHN              Received from\nER                   End and retrieve PNR\nFQ                   Fare quote\nFXP                  Price and store fare\nTKPFS/DTDAD          Issue ticket\nIG                   Ignore unsaved booking");return}
 if(command.startsWith("SON/")){state.signedIn=true;print("SIGN IN COMPLETE\nOFFICE ID: DACVS01  DUTY: TRAINING\nWELCOME TO GELLELIO GALILEO");}
 else if(!state.signedIn){print("SIGN IN REQUIRED - ENTER SON/AGENCY/PASSWORD","error");}
 else if(/^A\d{2}[A-Z]{3}[A-Z]{3}[A-Z]{3}/.test(command)){availability();}
 else if(/^N\d+[A-Z]\d+$/.test(command)){const line=Number(command.match(/^N(\d+)/)[1]);const flight=flights.find(item=>item.line===line);if(!state.availability||!flight){print("NEED AVAILABILITY DISPLAY FIRST","error");}else{state.segment=clone(flight);print(`  SELL CONFIRMED\n  ${flight.line} ${flight.carrier}${flight.number} ${flight.cls} HK1 ${flight.origin}${flight.destination} ${flight.date}`);}}
 else if(command.startsWith("N/")){const value=command.slice(2);if(!value.includes("/"))print("FORMAT ERROR - USE N/SURNAME/FIRSTNAME TITLE","error");else{state.name=value.replace(/\//,"/");print(`  NAME ADDED - ${value}`);}}
 else if(command.startsWith("9/")){state.phone=command.slice(2);print(`  CONTACT ADDED - ${state.phone}`);}
 else if(command.startsWith("T-")){state.ticketing=command.slice(2);print(`  TICKETING TIME LIMIT SET - ${state.ticketing}`);}
 else if(command.startsWith("RF-")){print(`  RECEIVED FROM - ${command.slice(3)}`);}
 else if(command==="ER"||command==="E"){if(!state.segment||!state.name){print("UNABLE TO END - NAME AND SEGMENT REQUIRED","error");}else{state.saved=true;state.locator="G7L3QK";print(`  PNR CREATED - ${state.locator}\n  ${state.name}\n  ${state.segment.carrier}${state.segment.number} HK1 ${state.segment.origin}${state.segment.destination}`);}}
 else if(command.startsWith("*")){state.locator=command.slice(1)||state.locator;if(state.locator==="G7L3QK"&&state.segment)print(`  RETRIEVED PNR ${state.locator}\n  ${state.name||"NO NAME"}\n  ${state.segment.carrier}${state.segment.number} HK1 ${state.segment.origin}${state.segment.destination}`);else print("RECORD NOT FOUND","error");}
 else if(command==="FQ"){if(!state.segment)print("NO AIR SEGMENT TO QUOTE","error");else{state.priced=true;print(`  FARE QUOTE\n  ${state.segment.origin}-${state.segment.destination}  ${state.segment.carrier}${state.segment.number}\n  BASE FARE                 BDT 32,500\n  TAXES                     BDT  6,840\n  TOTAL                     BDT 39,340`);}}
 else if(command==="FXP"){if(!state.priced)print("FARE QUOTE REQUIRED - ENTER FQ FIRST","error");else{state.storedFare=true;print("  FARE STORED - TST 00001 CREATED");}}
 else if(command.startsWith("TKP")){if(!state.storedFare||!state.saved)print("PNR MUST BE SAVED AND FARE STORED BEFORE ISSUE","error");else{state.issued=true;print(`  TICKET ISSUED SUCCESSFULLY\n  TICKET NUMBER: 999-1234567890\n  PNR: ${state.locator}\n  STATUS: CONFIRMED`);}}
 else if(command==="IG"){print("  PNR IGNORED - CHANGES DISCARDED");Object.assign(state,{segment:null,name:null,phone:null,ticketing:null,locator:null,priced:false,storedFare:false,issued:false,saved:false});}
 else print("UNABLE TO PROCESS - TYPE HELP FOR COMMANDS","error"); update(); }
form.addEventListener("submit",event=>{event.preventDefault();process(input.value);input.value="";});
const resetButton = document.getElementById("resetBtn");
if(resetButton) resetButton.addEventListener("click",reset);
document.querySelectorAll(".lesson").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll(".lesson").forEach(item=>item.classList.remove("active"));button.classList.add("active");state.lesson=button.dataset.lesson;print(`LESSON LOADED: ${button.textContent.trim()}`,"dim");}));
reset();
