(function (global) {
  const flights = [
    { line: 1, carrier: "BG", number: "147", cls: "Y", date: "01APR", origin: "DAC", destination: "JED", depart: "1420", arrive: "1745", seats: 9 },
    { line: 2, carrier: "SV", number: "809", cls: "Y", date: "01APR", origin: "MUX", destination: "JED", depart: "1910", arrive: "2205", seats: 4 },
    { line: 3, carrier: "EK", number: "585", cls: "Y", date: "01APR", origin: "DAC", destination: "DXB", depart: "1025", arrive: "1315", seats: 7 },
    { line: 4, carrier: "QR", number: "639", cls: "Y", date: "01APR", origin: "DAC", destination: "DOH", depart: "0300", arrive: "0540", seats: 6 },
    { line: 5, carrier: "EK", number: "584", cls: "Y", date: "01APR", origin: "DXB", destination: "DAC", depart: "1600", arrive: "2240", seats: 8 }
  ];
  global.GalileoFlights = {
    search({ date, origin, destination }) { return flights.filter(flight => (!date || flight.date === date) && (!origin || flight.origin === origin) && (!destination || flight.destination === destination)); },
    byLine(line, results) { return (results || flights).find(flight => flight.line === line) || null; },
    format(flight) { return `${String(flight.line).padStart(2, " ")} ${flight.carrier} ${flight.number} ${flight.cls}${flight.seats}  ${flight.origin} ${flight.destination} ${flight.depart} ${flight.arrive}  ${flight.date}`; }
  };
}(window));
