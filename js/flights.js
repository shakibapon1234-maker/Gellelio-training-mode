(function (global) {

  // Full flight schedule — mirrors screenshots from real Galileo terminal
  // classes: object of {bookingClass: seatsAvailable} — "C" means closed/waitlist
  const FLIGHTS = [
    /* ── DAC → JED ── */
    {
      line:1, carrier:"SV", number:"803", date:"01APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"0235", arrive:"0615", equip:"773",
      termOrig:"1", termDest:"1", airline_full:"SAUDI ARABIAN AIRLINES",
      classes:{J:2,C:2,D:2,I:2,Y:9,E:9,B:9,M:9,K:9},
      rows:["HC LC QC TC NC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "*AIRCRAFT OWNER SAUDI ARABIAN AIRLINES*",
             "*COCKPIT CREW SAUDI ARABIAN AIRLINES*",
             "*MAX CONNECTION TIME IS 12 HRS*",
             "*KSA LAW REQD FULL APIS IN SSR DOCS 72 HBD*",
             "*KSA MCT IS 3HRS FOR UMRAH OR 1ST ENTRY LABOR VISA*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
             "PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
             "WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
             "FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES"]
    },
    {
      line:2, carrier:"SV", number:"811", date:"01APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"0555", arrive:"0935", equip:"773",
      termOrig:"1", termDest:"1", airline_full:"SAUDI ARABIAN AIRLINES",
      classes:{J:9,C:9,D:9,I:9,Y:9,E:9,B:9,M:9,K:9},
      rows:["HC LC QC TC NC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "*AIRCRAFT OWNER SAUDI ARABIAN AIRLINES*",
             "*COCKPIT CREW SAUDI ARABIAN AIRLINES*",
             "*MAX CONNECTION TIME IS 12 HRS*",
             "*KSA LAW REQD FULL APIS IN SSR DOCS 72 HBD*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:3, carrier:"SV", number:"809", date:"01APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"1320", arrive:"1700", equip:"773",
      termOrig:"1", termDest:"1", airline_full:"SAUDI ARABIAN AIRLINES",
      classes:{J:3,C:3,D:2,I:2,Y:9,E:9,B:9,M:9,K:9},
      rows:["HC LC QC TC NC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "*AIRCRAFT OWNER SAUDI ARABIAN AIRLINES*",
             "*COCKPIT CREW SAUDI ARABIAN AIRLINES*",
             "*MAX CONNECTION TIME IS 12 HRS*",
             "*KSA LAW REQD FULL APIS IN SSR DOCS 72 HBD*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:4, carrier:"BS", number:"361", date:"01APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"1605", arrive:"2110", equip:"333",
      termOrig:"1", termDest:"1", airline_full:"US-BANGLA AIRLINES",
      classes:{Y:9,B:9,H:9,M:9,R:9,U:9,N:9,V:9,X:9},
      rows:["TC O9 IC KC EC SC GC L5"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "*AIRCRAFT OWNER US-BANGLA AIRLINES*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:5, carrier:"GF", number:"251", date:"01APR", freq:"01",
      origin:"DAC", destination:"BAH", depart:"0955", arrive:"1230", equip:"789",
      termOrig:"1", termDest:"1", airline_full:"GULF AIR",
      classes:{J:7,C:7,D:7,I:6,Y:7,H:7,M:7,L:7,B:7},
      rows:["K7 X7 Q7 V7 E7 O7 N7 S7 W7","G0"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES BAH TERMINAL 1",
             "*AIRCRAFT OWNER GULF AIR*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:6, carrier:"GF", number:"183", date:"01APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"1325", arrive:"1540", equip:"32Q",
      termOrig:"1", termDest:"1", airline_full:"GULF AIR",
      classes:{J:7,C:7,D:7,I:6,Y:7,H:7,M:7,L:7,B:7},
      rows:["K7 X7 Q7 V7 E7 O7 N7 S7 W7","G0"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "*AIRCRAFT OWNER GULF AIR*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },

    /* ── DAC → DXB ── */
    {
      line:7, carrier:"EK", number:"587", date:"01APR", freq:"01",
      origin:"DAC", destination:"DXB", depart:"1930", arrive:"2230", equip:"77W",
      termOrig:"1", termDest:"3", airline_full:"EMIRATES",
      classes:{J:"C",C:"C",I:"C",O:"C",Y:"C",R:"C",X:"C",M:"C",B:"C"},
      rows:["UC KC QC LC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES DXB TERMINAL 3",
             "TOTAL JOURNEY TIME: 05:00",
             "GROUND TIME: 01:45",
             "ON TIME PERFORMANCE: NO FLIGHT DATA AVAILABLE",
             "*AIRCRAFT OWNER EMIRATES*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:8, carrier:"EK", number:"801", date:"02APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"0010", arrive:"0205", equip:"388",
      termOrig:"1", termDest:"1", airline_full:"EMIRATES",
      classes:{F:"C",A:"C",J:"C",C:"C",I:"C",O:"C",Y:"C",R:"C",X:"C"},
      rows:["MC BC UC KC QC LC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "*AIRCRAFT OWNER EMIRATES*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:9, carrier:"EK", number:"587", date:"01APR", freq:"01",
      origin:"DAC", destination:"DXB", depart:"1930", arrive:"2230", equip:"77W",
      termOrig:"1", termDest:"3", airline_full:"EMIRATES",
      classes:{J:"C",C:"C",I:"C",O:"C",Y:"C",R:"C",X:"C",M:"C",B:"C"},
      rows:["UC KC QC LC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES DXB TERMINAL 3",
             "*AIRCRAFT OWNER EMIRATES*"]
    },
    {
      line:10, carrier:"MK", number:"9960", date:"02APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"0015", arrive:"0225", equip:"388",
      termOrig:"1", termDest:"1", airline_full:"AIR MAURITIUS",
      classes:{F:2,A:"C",J:4,D:4,C:4,R:4,I:4,Y:4,K:4},
      rows:["H4 S4 T4 U4 V4 L4 Q4 M4 O4","X4 GC B4 E4"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },

    /* ── DAC → DOH ── */
    {
      line:11, carrier:"QR", number:"639", date:"01APR", freq:"01",
      origin:"DAC", destination:"DOH", depart:"0400", arrive:"0650", equip:"77W",
      termOrig:"1", termDest:"1", airline_full:"QATAR AIRWAYS",
      classes:{J:9,C:9,D:9,I:9,R:9,P:9,Y:9,B:9,H:9},
      rows:["K9 M9 L9 V9 S9 N9 Q9 T9 O9","WC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES DOH TERMINAL 1",
             "*AIRCRAFT OWNER QATAR AIRWAYS*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:12, carrier:"QR", number:"1192", date:"01APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"0820", arrive:"1100", equip:"789",
      termOrig:"1", termDest:"1", airline_full:"QATAR AIRWAYS",
      classes:{F:9,A:9,Y:9,B:9,H:9,K:9,M:9,L:9,V:9},
      rows:["S9 N9 Q9 T9 O9 WC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "*AIRCRAFT OWNER QATAR AIRWAYS*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },

    /* ── DAC → RUH ── */
    {
      line:13, carrier:"SV", number:"805", date:"01APR", freq:"01",
      origin:"DAC", destination:"RUH", depart:"0045", arrive:"0340", equip:"773",
      termOrig:"1", termDest:"1", airline_full:"SAUDI ARABIAN AIRLINES",
      classes:{J:2,C:2,D:1,I:1,Y:9,E:9,B:9,M:9,K:9},
      rows:["HC LC QC TC NC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES RUH TERMINAL 1",
             "*AIRCRAFT OWNER SAUDI ARABIAN AIRLINES*",
             "*COCKPIT CREW SAUDI ARABIAN AIRLINES*",
             "*MAX CONNECTION TIME IS 12 HRS*",
             "*KSA LAW REQD FULL APIS IN SSR DOCS 72 HBD*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:14, carrier:"SV", number:"1019", date:"01APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"0600", arrive:"0745", equip:"320",
      termOrig:"1", termDest:"1", airline_full:"SAUDI ARABIAN AIRLINES",
      classes:{J:2,C:2,D:1,I:1,Y:9,E:9,B:9,M:9,K:9},
      rows:["HC LC QC TC NC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "*AIRCRAFT OWNER SAUDI ARABIAN AIRLINES*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:15, carrier:"EK", number:"585", date:"01APR", freq:"01",
      origin:"DAC", destination:"DXB", depart:"0140", arrive:"0430", equip:"77W",
      termOrig:"1", termDest:"3", airline_full:"EMIRATES",
      classes:{J:"C",C:"C",I:"C",O:"C",Y:"C",R:"C",X:"C",M:"C",B:"C"},
      rows:["UC KC QC LC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES DXB TERMINAL 3",
             "*AIRCRAFT OWNER EMIRATES*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    },
    {
      line:16, carrier:"EK", number:"805", date:"01APR", freq:"01",
      origin:"DAC", destination:"JED", depart:"0655", arrive:"0845", equip:"388",
      termOrig:"1", termDest:"1", airline_full:"EMIRATES",
      classes:{J:"C",C:"C",I:"C",O:"C",Y:"C",R:"C",X:"C",M:"C",B:"C"},
      rows:["MC BC UC KC QC LC VC"],
      notes:["DEPARTS DAC TERMINAL 1 - ARRIVES JED TERMINAL 1",
             "*AIRCRAFT OWNER EMIRATES*",
             "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS"]
    }
  ];

  function search({ origin, destination }) {
    const results = FLIGHTS.filter(f =>
      (!origin || f.origin === origin) &&
      (!destination || f.destination === destination)
    );
    return results.map((f, i) => Object.assign({}, f, { line: i + 1 }));
  }

  function byLine(lineNum, results) {
    return (results || FLIGHTS).find(f => f.line === lineNum) || null;
  }

  // Format class string: "J2 C2 D2 I2 Y9 E9 B9 M9 K9"
  function formatClasses(cls) {
    return Object.entries(cls).map(([k, v]) => `${k}${v}`).join(' ');
  }

  // Main availability line (Galileo style)
  // " 1 DAC JED01/ 0235 0615  SV  803  J2 C2 D2 I2 Y9 E9 B9 M9 K9 773 C*E"
  function formatLine(f) {
    const ln  = String(f.line).padStart(2, ' ');
    const prefix = f.origin === 'DAC' ? 'DAC ' : '    ';
    const dest   = `${f.destination}${f.freq}/`;
    const cls    = formatClasses(f.classes);
    return `${ln} ${prefix}${dest} ${f.depart} ${f.arrive}  ${f.carrier} ${f.number.padStart(4,' ')}  ${cls} ${f.equip} C*E`;
  }

  global.GalileoFlights = { search, byLine, formatLine, formatClasses, all: FLIGHTS };
}(window));