(function (global) {
  function quote(segment) {
    const base = segment.origin === "DAC" && segment.destination === "DXB" ? 28500 : 32500;
    const taxes = Math.round(base * 0.21);
    return { base, taxes, total: base + taxes, currency: "BDT", reference: "YOWBD" };
  }

  global.GalileoFareShop = { quote };
}(window));