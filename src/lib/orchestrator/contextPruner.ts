import type { KundliData, AstrologyIntent, ClassicalRuleCitation } from "../../types";
import { retrieveClassicalEvidence } from "./classicalRules";

export type PrunedContextResult = {
  intent: AstrologyIntent;
  intentDescription: string;
  prunedFacts: Record<string, any>;
  prunedFactsSummary: string[];
  matchedRules: ClassicalRuleCitation[];
  rawEstimatedTokens: number;
  prunedEstimatedTokens: number;
  tokensSavedPercentage: number;
};

/**
 * Classifies user intent from natural language question
 */
export function classifyAstrologyIntent(question: string): AstrologyIntent {
  const q = question.toLowerCase();

  // Career / Profession / Job
  if (
    q.includes("career") ||
    q.includes("job") ||
    q.includes("business") ||
    q.includes("naukri") ||
    q.includes("vyapar") ||
    q.includes("promotion") ||
    q.includes("office") ||
    q.includes("work") ||
    q.includes("profession")
  ) {
    return "CAREER_10TH_HOUSE";
  }

  // Marriage / Love / Relationship / Spouse
  if (
    q.includes("marriage") ||
    q.includes("vivah") ||
    q.includes("shaadi") ||
    q.includes("shadi") ||
    q.includes("spouse") ||
    q.includes("husband") ||
    q.includes("wife") ||
    q.includes("pati") ||
    q.includes("patni") ||
    q.includes("relationship") ||
    q.includes("love") ||
    q.includes("pyaar")
  ) {
    return "MARRIAGE_7TH_HOUSE";
  }

  // Wealth / Money / Finance / Gains
  if (
    q.includes("wealth") ||
    q.includes("money") ||
    q.includes("paisa") ||
    q.includes("dhan") ||
    q.includes("finance") ||
    q.includes("investment") ||
    q.includes("property") ||
    q.includes("karz") ||
    q.includes("loan")
  ) {
    return "WEALTH_2ND_11TH";
  }

  // Health / Illness / Mental Peace / Longevity
  if (
    q.includes("health") ||
    q.includes("swasthya") ||
    q.includes("bimari") ||
    q.includes("disease") ||
    q.includes("depression") ||
    q.includes("stress") ||
    q.includes("hospital") ||
    q.includes("mental")
  ) {
    return "HEALTH_6TH_8TH";
  }

  // Remedies / Upay / Mantras
  if (
    q.includes("remedy") ||
    q.includes("upay") ||
    q.includes("mantra") ||
    q.includes("puja") ||
    q.includes("totka") ||
    q.includes("daan")
  ) {
    return "DOSHA_REMEDY";
  }

  // General Definitions
  if (
    q.includes("kya hota hai") ||
    q.includes("what is") ||
    q.includes("meaning of") ||
    q.includes("explain")
  ) {
    return "GENERAL_SHASTRA_DEF";
  }

  return "COMPLEX_SYNTHESIS";
}

/**
 * Extracts ONLY the minimal relevant chart parameters based on classified intent.
 * Prevents blowing 5,000 - 20,000 tokens of raw chart ephemeris.
 */
export function pruneAstrologyContext(
  question: string,
  kundli: KundliData | null
): PrunedContextResult {
  const intent = classifyAstrologyIntent(question);
  const matchedRules = retrieveClassicalEvidence(intent, question);

  // Fallback if no Kundli available
  if (!kundli) {
    return {
      intent,
      intentDescription: "General Astrology Inquiry (No Chart Attached)",
      prunedFacts: {
        note: "Generic consultation mode without user natal coordinates."
      },
      prunedFactsSummary: ["No chart coordinates attached. General shastra guidance."],
      matchedRules,
      rawEstimatedTokens: 2500,
      prunedEstimatedTokens: 180,
      tokensSavedPercentage: 92.8,
    };
  }

  const house1 = kundli.houses[0];
  const currentDasha = kundli.currentDasha;

  let prunedFacts: Record<string, any> = {};
  let prunedFactsSummary: string[] = [];
  let intentDescription = "";

  switch (intent) {
    case "CAREER_10TH_HOUSE": {
      intentDescription = "Career, Profession & Social Standing (10th Bhava / Karmasthana)";
      const house10 = kundli.houses[9] || { house: 10, sign: "Makara", signLord: "Shani", planets: [] };
      prunedFacts = {
        house10_sign: house10.sign,
        house10_lord: house10.signLord,
        planets_in_house10: house10.planets,
        lagna: kundli.lagna,
        lagnaLord: kundli.lagnaLord,
        currentDasha: currentDasha,
        keySignificators: ["Surya (Sun - authority)", "Budh (Mercury - intellect/commerce)", "Shani (Saturn - career discipline)"],
      };
      prunedFactsSummary = [
        `10th House Sign: ${house10.sign} (Lord: ${house10.signLord})`,
        `Planets in 10th House: ${house10.planets.length > 0 ? house10.planets.join(", ") : "None (Vacant, governed by lord)"}`,
        `Current Operating Dasha: ${currentDasha}`,
        `Ascendant (Lagna): ${kundli.lagna} (Lord: ${kundli.lagnaLord})`,
      ];
      break;
    }

    case "MARRIAGE_7TH_HOUSE": {
      intentDescription = "Marriage, Partnerships & Harmony (7th Bhava / Kalatrasthana)";
      const house7 = kundli.houses[6] || { house: 7, sign: "Tula", signLord: "Shukra", planets: [] };
      prunedFacts = {
        house7_sign: house7.sign,
        house7_lord: house7.signLord,
        planets_in_house7: house7.planets,
        isManglik: kundli.isManglik,
        currentDasha: currentDasha,
        naturalSignificator: "Shukra (Venus - marital happiness)",
      };
      prunedFactsSummary = [
        `7th House Sign: ${house7.sign} (Lord: ${house7.signLord})`,
        `Planets in 7th House: ${house7.planets.length > 0 ? house7.planets.join(", ") : "None (Influenced by aspects)"}`,
        `Mangal Dosha Status: ${kundli.isManglik ? "Active Kuja Dosha" : "Free from Manglik dosha"}`,
        `Current Dasha: ${currentDasha}`,
      ];
      break;
    }

    case "WEALTH_2ND_11TH": {
      intentDescription = "Wealth, Savings & Cash Inflow (2nd & 11th Bhavas)";
      const house2 = kundli.houses[1] || { house: 2, sign: "Vrishabha", signLord: "Shukra", planets: [] };
      const house11 = kundli.houses[10] || { house: 11, sign: "Kumbha", signLord: "Shani", planets: [] };
      prunedFacts = {
        house2_accumulated_wealth: { sign: house2.sign, lord: house2.signLord, planets: house2.planets },
        house11_gains_cashflow: { sign: house11.sign, lord: house11.signLord, planets: house11.planets },
        currentDasha: currentDasha,
        naturalSignificator: "Guru (Jupiter - Dhana Karaka)",
      };
      prunedFactsSummary = [
        `2nd House (Dhana): ${house2.sign} governed by ${house2.signLord} (${house2.planets.join(", ") || "vacant"})`,
        `11th House (Labha): ${house11.sign} governed by ${house11.signLord} (${house11.planets.join(", ") || "vacant"})`,
        `Current Dasha: ${currentDasha}`,
      ];
      break;
    }

    case "HEALTH_6TH_8TH": {
      intentDescription = "Health, Vitality & Obstacles (6th & 8th Bhavas)";
      const house6 = kundli.houses[5] || { house: 6, sign: "Kanya", signLord: "Budh", planets: [] };
      const house8 = kundli.houses[7] || { house: 8, sign: "Vrischika", signLord: "Mangal", planets: [] };
      prunedFacts = {
        lagna_vitality: { sign: house1.sign, lord: house1.signLord },
        house6_rogasthana: { sign: house6.sign, lord: house6.signLord, planets: house6.planets },
        house8_ayursthana: { sign: house8.sign, lord: house8.signLord, planets: house8.planets },
        element: kundli.element,
        currentDasha: currentDasha,
      };
      prunedFactsSummary = [
        `Vitality Base (Lagna): ${house1.sign} (${kundli.element} element)`,
        `6th House (Disease/Debts): ${house6.sign} (Lord: ${house6.signLord})`,
        `8th House (Longevity/Sudden events): ${house8.sign} (Lord: ${house8.signLord})`,
      ];
      break;
    }

    case "DOSHA_REMEDY": {
      intentDescription = "Vedic Doshas & Remedial Guidance (Shanti Upay)";
      prunedFacts = {
        isManglik: kundli.isManglik,
        currentDasha: currentDasha,
        lagnaLord: kundli.lagnaLord,
        luckyGemstone: kundli.luckyGemstone,
        luckyColor: kundli.luckyColor,
      };
      prunedFactsSummary = [
        `Manglik Status: ${kundli.isManglik ? "Manglik" : "Non-Manglik"}`,
        `Prescribed Gemstone: ${kundli.luckyGemstone}`,
        `Current Mahadasha: ${currentDasha}`,
      ];
      break;
    }

    default: {
      intentDescription = "Holistic Synthesis";
      prunedFacts = {
        lagna: kundli.lagna,
        lagnaLord: kundli.lagnaLord,
        moonSign: kundli.moonSign,
        nakshatra: kundli.nakshatra,
        currentDasha: currentDasha,
      };
      prunedFactsSummary = [
        `Ascendant: ${kundli.lagna} (${kundli.lagnaLord})`,
        `Moon: ${kundli.moonSign} in ${kundli.nakshatra}`,
        `Current Dasha: ${currentDasha}`,
      ];
      break;
    }
  }

  // Token savings calculations
  // A raw full chart with 12 divisional charts, shadbala, ashtakavarga, and planetary tables = ~4,500 tokens
  const rawEstimatedTokens = 4250;
  // Pruned payload is ~220-280 tokens
  const prunedEstimatedTokens = Math.max(160, JSON.stringify(prunedFacts).length / 3.5 + 80);
  const tokensSavedPercentage = Number(
    (((rawEstimatedTokens - prunedEstimatedTokens) / rawEstimatedTokens) * 100).toFixed(1)
  );

  return {
    intent,
    intentDescription,
    prunedFacts,
    prunedFactsSummary,
    matchedRules,
    rawEstimatedTokens,
    prunedEstimatedTokens: Math.round(prunedEstimatedTokens),
    tokensSavedPercentage,
  };
}
