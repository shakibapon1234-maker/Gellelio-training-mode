(function (global) {
  const lessons = {
    BASIC: {
      title: "BASIC ONE-WAY BOOKING",
      objective: "Create and retrieve a one-passenger PNR.",
      commands: ["SON/DEMO/DEMO", "A01APRDACJED", "N1Y1", "N/DOE/JOHN MR", "9/8801712345678", "T-01APR", "RF-JOHN", "ER"]
    },
    TICKETING: {
      title: "PNR PRICING AND TICKETING",
      objective: "Retrieve a saved PNR, quote the fare, store it, and issue a practice ticket.",
      commands: ["*G7L3QK", "FQ", "FXP", "TKPFS/DTDAD"]
    },
    MODIFICATION: {
      title: "PNR MODIFICATION",
      objective: "Practice cancelling a booked air segment and adding a special service.",
      commands: ["*G7L3QK", "X1", "SI.SSR MEAL"]
    }
  };

  global.GalileoLessons = {
    get(name) { return lessons[name.trim().toUpperCase()] || null; },
    format(lesson) { return [`LESSON: ${lesson.title}`, `OBJECTIVE: ${lesson.objective}`, "COMMAND SEQUENCE:", ...lesson.commands.map((command, index) => `${index + 1}. ${command}`)]; }
  };
}(window));