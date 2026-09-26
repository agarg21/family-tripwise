// Official published constraints, not live operations or family suitability.
export const restDayEvidence = {
  checkedOn: "2026-09-26",
  recheckOn: "2026-10-26",
  sources: {
    O1: "https://www.osc.org/visit/",
    O2: "https://www.osc.org/visit/exhibits/kidstown/",
    C1: "https://www.crayolaexperience.com/orlando/plan-your-visit/faqs",
    C2: "https://www.crayolaexperience.com/orlando/plan-your-visit/hours",
    S1: "https://www.visitsealife.com/orlando/plan-your-day/",
    S2: "https://www.visitsealife.com/orlando/plan-your-day/information/faqs/",
    S3: "https://www.visitsealife.com/orlando/plan-your-day/before-you-visit/opening-hours/"
  },
  records: [
    {
      id: "science-center", name: "Orlando Science Center",
      schedule: { normallyClosedWeekdays: [3], note: "Normally closed Wednesdays except OCPS breaks; holiday closures also apply. Check the dated calendar.", sourceIds: ["O1"] },
      reentry: { policy: "unknown", condition: null, sourceIds: ["O1"] },
      duration: { minutes: null, sourceIds: ["O1"] },
      childArea: { name: "KidsTown", recommendedMaximumAge: 7, sourceIds: ["O2"] },
      meal: { note: "Dated meal options and return-entry terms need confirmation.", sourceIds: ["O1"] }
    },
    {
      id: "crayola", name: "Crayola Experience Orlando",
      schedule: { normallyClosedWeekdays: [], note: "Published daily operation; verify dated exceptions and hours.", sourceIds: ["C2"] },
      reentry: { policy: "conditional", condition: "Same-day return before closing requires a hand stamp before leaving.", sourceIds: ["C1"] },
      duration: { minutes: [180, 240], sourceIds: ["C1"] },
      childArea: null,
      meal: { note: "Outside food/drink not permitted; cafe listed for weekends, snack counter listed as open. Recheck for your day.", sourceIds: ["C1"] }
    },
    {
      id: "sea-life", name: "SEA LIFE Orlando",
      schedule: { normallyClosedWeekdays: [], note: "Plan page describes daily operation; exact dated hours must be checked on opening-hours page.", sourceIds: ["S1", "S3"] },
      reentry: { policy: "unknown", condition: null, sourceIds: ["S2"] },
      duration: { minutes: [120, 180], sourceIds: ["S1"] },
      childArea: null,
      meal: { note: "Food/drink not permitted inside. Permission to stay until closing does not establish permission to leave and return.", sourceIds: ["S2"] }
    }
  ]
};
