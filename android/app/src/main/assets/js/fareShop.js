(function (global) {
  const OPTIONS = [
    { carrier: "TG", number: "322", cls: "W", date: "16DEC", origin: "DAC", destination: "BKK", depart: "1340", arrive: "1710", stop: "WE", stopFlight: "333", total: 32405, suffix: "WLOSV" },
    { carrier: "BS", number: "217", cls: "T", date: "16DEC", origin: "DAC", destination: "BKK", depart: "0935", arrive: "1310", stop: "WE", stopFlight: "738", total: 34012, suffix: "TBDTHO" },
    { carrier: "BG", number: "388", cls: "B", date: "16DEC", origin: "DAC", destination: "BKK", depart: "1115", arrive: "1500", stop: "WE", stopFlight: "738", total: 34012, suffix: "BBDO" },
    { carrier: "MU", number: "2036", cls: "V", date: "16DEC", origin: "DAC", destination: "KMG", depart: "1405", arrive: "1830", stop: "WE", stopFlight: "738", total: 39053, suffix: "VSE0WCSF", second: { number: "963", date: "17DEC", origin: "KMG", destination: "BKK", depart: "0815", arrive: "0950", stop: "TH", stopFlight: "738" } },
    { carrier: "#6E", number: "1106", cls: "X", date: "16DEC", origin: "DAC", destination: "CCU", depart: "1445", arrive: "1515", stop: "WE", stopFlight: "320", total: 40348, suffix: "R0INT", second: { number: "1107", date: "17DEC", origin: "CCU", destination: "BKK", depart: "0025", arrive: "0435", stop: "TH", stopFlight: "320" } }
  ];

  function pricingOptions(segment) {
    return OPTIONS.map(option => Object.assign({}, option, {
      origin: segment && segment.origin || option.origin,
      destination: segment && segment.destination || option.destination,
      date: segment && segment.date || option.date
    }));
  }

  function quote(segment) {
    const base = segment.origin === "DAC" && segment.destination === "DXB" ? 28500 : 32500;
    const taxes = Math.round(base * 0.21);
    return { base, taxes, total: base + taxes, currency: "BDT", reference: "YOWBD", options: pricingOptions(segment) };
  }
  global.GalileoFareShop = { quote, pricingOptions };
}(window));
