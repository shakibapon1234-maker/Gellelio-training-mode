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

  function search({ origin, destination, carrier }) {
    // DAC-JED training board matches the live Smartpoint availability (direct + connections)
    let results;
    if (origin === "DAC" && destination === "BKK") {
      const carriers = [["TG", "340", "330"], ["TG", "322", "333"], ["OD", "163", "7M8"], ["TG", "418", "789"], ["BS", "315", "333"], ["@TG", "4716", "7M8"], ["MH", "197", "332"], ["@TG", "4702", "7M8"], ["SQ", "447", "787"], ["TG", "402", "320"], ["MH", "103", "7M8"], ["TG", "418", "789"], ["BS", "315", "333"], ["@TG", "4782", "73H"], ["VZ", "307", "320"]];
      results = carriers.map((flight, index) => ({ line: index + 1, carrier: flight[0], number: flight[1], date: "15NOV", freq: "15", origin: "DAC", destination: index === 2 || index === 6 ? "KUL" : "BKK", depart: ["0200", "1340", "1300", "2105", "0825", "1620", "0050", "0910", "2355", "0815", "1230", "2105", "0825", "1520", "1730"][index], arrive: ["0530", "1710", "1850", "2210", "1420", "1740", "0650", "1020", "0600", "0935", "1840", "2210", "1420", "1545", "1900"][index], equip: flight[2], termOrig: "1", termDest: "1", airline_full: "TRAINING CARRIER", classes: { C: 9, D: 9, J: 9, Z: 9, Y: 9, B: 9, M: 9, H: 9, Q: 9 }, rows: ["T9 K9 S9 V9 W9 LC"], notes: [] }));
    } else if (origin === "DAC" && destination === "JED") {
      results = FLIGHTS.slice();
    } else {
      results = FLIGHTS.filter(f =>
        (!origin || f.origin === origin) &&
        (!destination || f.destination === destination)
      );
    }
    if (carrier) results = results.filter(f => f.carrier === carrier);
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
  function formatParts(f) {
    return {
      ln: String(f.line).padStart(2, " "),
      orig: f.origin,
      dest: `${f.destination}${f.freq}/`,
      depart: f.depart,
      arrive: f.arrive,
      carrier: f.carrier,
      number: String(f.number).padStart(4, " "),
      classes: formatClasses(f.classes),
      equip: f.equip,
      flag: "C*E"
    };
  }

  function formatLine(f) {
    const p = formatParts(f);
    return `${p.ln} ${p.orig} ${p.dest} ${p.depart} ${p.arrive}  ${p.carrier} ${p.number}  ${p.classes} ${p.equip} ${p.flag}`;
  }

  global.GalileoFlights = { search, byLine, formatLine, formatParts, formatClasses, all: FLIGHTS };
}(window));