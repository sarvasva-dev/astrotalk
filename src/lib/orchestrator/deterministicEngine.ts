import type { KundliData, ClassicalRuleCitation } from "../../types";
import { CLASSICAL_RULES_DATABASE } from "./classicalRules";

export type DeterministicAnswerResult = {
  canAnswer: boolean;
  answerText: string;
  matchedRules: ClassicalRuleCitation[];
  factsSummary: string[];
  intentLabel: string;
};

/**
 * Checks if a question can be completely and accurately answered
 * by the mathematical calculation engine or static classical Shastra definitions,
 * bypassing ANY LLM invocation (0 tokens, 0 credits charged).
 */
export function evaluateDeterministicAnswer(
  userQuestion: string,
  kundli: KundliData | null
): DeterministicAnswerResult {
  const q = userQuestion.trim().toLowerCase();

  // 1. Definition Queries: "Purva Phalguni kya hota hai?", "Purva Phalguni nakshatra"
  if (q.includes("purva phalguni") || (q.includes("phalguni") && !q.includes("uttara"))) {
    const rule = CLASSICAL_RULES_DATABASE.find((r) => r.id === "DEF-PURVA-PHALGUNI")!;
    return {
      canAnswer: true,
      intentLabel: "SHASTRA_DEF: Purva Phalguni Nakshatra",
      answerText: `पूर्वाफाल्गुनी (Purva Phalguni) वैदिक ज्योतिष चक्र का 11वां नक्षत्र है, जो सिंह राशि में 13°20' से 26°40' तक विस्तृत है।

• स्वामी ग्रह (Ruler): शुक्र (Venus / Shukra)
• अधिष्ठाता देवता (Deity): भग (Bhaga — समृद्धि, सौभाग्य व आनंद के देवता)
• प्रतीक चिन्ह (Symbol): विश्राम की शैय्या (Front legs of bed / Couch)
• प्रकृति व तत्व: मानुष्य गण, स्थिर व कलात्मक स्वभाव

शास्त्रीय प्रमाण: ${rule.sourceText} (${rule.chapter}, ${rule.verse}):
"${rule.sanskritSloka}"
अर्थात्: पूर्वाफाल्गुनी नक्षत्र में जन्मे व्यक्ति स्वाभाविक रूप से प्रियभाषी (मधुर वाणी), दानी, संगीत व सौंदर्य प्रेमी, और समाज में विशिष्ट सम्मान प्राप्त करने वाले होते हैं।`,
      matchedRules: [rule],
      factsSummary: [
        "11th Nakshatra: 13°20' - 26°40' Leo (Simha)",
        "Lord: Shukra (Venus) | Deity: Bhaga",
        "Significators: Creative arts, diplomacy, wealth, charismatic charm"
      ],
    };
  }

  // 2. Definition Queries: "Sade Sati kya hoti hai?", "Shani Sade Sati kya hai"
  if ((q.includes("sade sati") || q.includes("saade sati")) && (q.includes("kya") || q.includes("what is") || q.includes("batao") || q.includes("meaning"))) {
    const rule = CLASSICAL_RULES_DATABASE.find((r) => r.id === "SARAVALI-46-9")!;
    return {
      canAnswer: true,
      intentLabel: "SHASTRA_DEF: Shani Sade Sati",
      answerText: `शनि की साढ़े साती (Shani Sade Sati) शनि ग्रह (Saturn) के गोचर काल की 7.5 वर्षों की एक महत्वपूर्ण खगोलीय व ज्योतिषीय अवधि है।

• गणना नियम: जब शनि आपकी जन्मकालीन चंद्र राशि (Natal Moon Sign) से 12वें भाव, लग्न/प्रथम भाव (स्वयं चंद्र राशि), और 2रे भाव में गोचर करता है, तो प्रत्येक राशि में 2.5 वर्ष रहने के कारण यह कुल 7.5 वर्ष की अवधि बनती है।
• तीन चरण (Phases):
  1. प्रथम चरण (उदय): मानसिक चिंतन, व्यय, व आत्मनिरीक्षण।
  2. द्वितीय चरण (शिखर): कर्म की परीक्षा, कठिन परिश्रम, व अनुशासन।
  3. तृतीय चरण (अस्त): ज्ञान, स्थायित्व व नए मार्ग का उदय।

शास्त्रीय प्रमाण: ${rule.sourceText} (${rule.chapter}):
"${rule.sanskritSloka}"
यह कोई अभिशाप नहीं बल्कि कर्म-शोधन व परिपक्वता का समय है। यदि कुंडली में शनि कारक (उदा. वृषभ, तुला, मकर, कुंभ) हो, तो साढ़े साती में ही अप्रत्याशित सफलता व प्रतिष्ठा प्राप्त होती है।`,
      matchedRules: [rule],
      factsSummary: [
        "Duration: 7.5 Years across 12th, 1st, 2nd house from Natal Moon",
        "Source: Saravali Ch. 46 Verse 9",
        "Core Purport: Karmic audit, discipline, maturity (Not a curse)"
      ],
    };
  }

  // 3. Definition Queries: "Gaj Kesari yog kya hota hai?", "Gajakesari yoga"
  if (q.includes("gaj kesari") || q.includes("gajakesari") || q.includes("gajkesari")) {
    const rule = CLASSICAL_RULES_DATABASE.find((r) => r.id === "DEF-GAJAKESARI")!;
    return {
      canAnswer: true,
      intentLabel: "SHASTRA_DEF: Gajakesari Yoga",
      answerText: `गजकेसरी योग (Gajakesari Yoga) वैदिक ज्योतिष के सबसे शुभ व कीर्तिदायक राजयोगों में से एक है।

• योग निर्माण सूत्र: जब बृहस्पति (Guru) चंद्र (Chandra) से अथवा लग्न से केन्द्र (1st, 4th, 7th, 10th भाव) में स्थित हों, तब गजकेसरी योग का पूर्ण निर्माण होता है।
• नाम का अर्थ: 'गज' (हाथी सदृश अपार शक्ति व धैर्य) + 'केसरी' (सिंह सदृश निर्भय तेज व नेतृत्व)।

शास्त्रीय प्रमाण: ${rule.sourceText} (${rule.chapter}, ${rule.verse}):
"${rule.sanskritSloka}"
फल: यह योग जातक को तीक्ष्ण बुद्धि, दीर्घायु, अकाट्य तर्कशक्ति, राजदरबार या आधुनिक कॉर्पोरेट व शासन में सर्वोच्च सम्मान प्रदान करता है।`,
      matchedRules: [rule],
      factsSummary: [
        "Formula: Jupiter in Kendra (1, 4, 7, 10) from Moon or Ascendant",
        "Source: BPHS Ch. 36 Verse 3",
        "Results: Intellect, moral authority, enduring repute"
      ],
    };
  }

  // If no Kundli provided, remaining chart-specific questions cannot be answered deterministically
  if (!kundli) {
    return {
      canAnswer: false,
      answerText: "",
      matchedRules: [],
      factsSummary: [],
      intentLabel: "UNKNOWN_REQUIRE_CHART",
    };
  }

  // 4. Chart-Specific: "Meri lagna kya hai?", "Lagna lord kaun hai?", "Ascendant kya hai"
  if (q.includes("lagna") || q.includes("ascendant") || q.includes("lagn")) {
    if (q.includes("kya") || q.includes("kaun") || q.includes("batao") || q.includes("which") || q.includes("what")) {
      return {
        canAnswer: true,
        intentLabel: "CHART_DETERMINISTIC: Lagna & Lagnesh",
        answerText: `आपके जन्म विवरण के आधार पर गणना परिणाम:\n\n• आपकी जन्म लग्न (Ascendant): ${kundli.lagna}\n• लग्नेश (Lagna Lord): ${kundli.lagnaLord}\n• लग्न तत्व (Element): ${kundli.element}\n• जीवन रत्न (Lucky Gemstone): ${kundli.luckyGemstone}\n\nआपकी प्रथम भाव की शक्ति बताती है कि आपका मूल स्वभाव ${kundli.element} तत्व से ओत-प्रोत है। लग्नेश ${kundli.lagnaLord} की स्थिति आपके समग्र स्वास्थ्य और आत्मबल की नींव है।`,
        matchedRules: [CLASSICAL_RULES_DATABASE[0]],
        factsSummary: [
          `Calculated Lagna: ${kundli.lagna}`,
          `Lagna Lord: ${kundli.lagnaLord}`,
          `Element: ${kundli.element}`,
        ],
      };
    }
  }

  // 5. Chart-Specific: "Mera moon sign kya hai?", "Rashi kya hai?", "Chandra rashi"
  if ((q.includes("moon sign") || q.includes("chandra rashi") || q.includes("rashi") || q.includes("raashi")) && (q.includes("kya") || q.includes("batao") || q.includes("kaun"))) {
    return {
      canAnswer: true,
      intentLabel: "CHART_DETERMINISTIC: Chandra Rashi & Nakshatra",
      answerText: `आपकी जन्म कुंडली के अनुसार सटीक चंद्र विवरण:\n\n• चंद्र राशि (Moon Sign): ${kundli.moonSign}\n• जन्म नक्षत्र (Janma Nakshatra): ${kundli.nakshatra}\n• स्वभाव तत्व: मन व भावनात्मक निर्णय चंद्र राशि से संचालित होते हैं।\n• शुभ अंक (Lucky Number): ${kundli.luckyNumber}\n• शुभ रंग (Lucky Color): ${kundli.luckyColor}`,
      matchedRules: [CLASSICAL_RULES_DATABASE[10]],
      factsSummary: [
        `Moon Sign: ${kundli.moonSign}`,
        `Nakshatra: ${kundli.nakshatra}`,
        `Lucky Number: ${kundli.luckyNumber}`,
      ],
    };
  }

  // 6. Chart-Specific: "Manglik dosha hai kya?", "Kya main manglik hoon?"
  if (q.includes("manglik") || q.includes("mangal dosha") || q.includes("kuja dosha")) {
    const rule = CLASSICAL_RULES_DATABASE.find((r) => r.id === "BPHS-20-14-MANGLIK")!;
    return {
      canAnswer: true,
      intentLabel: "CHART_DETERMINISTIC: Mangal Dosha Audit",
      answerText: kundli.isManglik
        ? `हाँ, आपके जन्मांग के भाव संयोजन के अनुसार कुंडली में मांगलिक योग (Kuja Dosha) की उपस्थिति दर्ज है।

शास्त्रीय प्रमाण: ${rule.sourceText} (${rule.chapter}):
"${rule.sanskritSloka}"
परामर्श: मांगलिक होना कोई भय का विषय नहीं है। विवाह मिलान में 28+ गुण मिलान अथवा सामने वाले साथी की कुंडली में शनि या मंगल का साम्य देखने पर यह प्रभाव स्वतः शांत हो जाता है। मंगलवार को सुंदरकांड का पाठ व हनुमान चालीसा श्रेष्ठ संतुलन प्रदान करता है।`
        : `शुभ सूचना: आपकी जन्म कुंडली के भाव 1, 4, 7, 8 अथवा 12 में मंगल की प्रतिकूल उपस्थिति नहीं है — आप मांगलिक दोष से पूर्णतः मुक्त हैं। वैवाहिक भाव सौम्य व अनुकूल स्थिति में है।`,
      matchedRules: [rule],
      factsSummary: [
        `Manglik Status: ${kundli.isManglik ? "Active Kuja Dosha" : "No Manglik Dosha (Clean)"}`,
        "Verified against Houses 1, 4, 7, 8, 12",
      ],
    };
  }

  // 7. Chart-Specific: "Kaun si dasha chal rahi hai?", "Current dasha", "Mahadasha"
  if (q.includes("dasha") || q.includes("mahadasha")) {
    return {
      canAnswer: true,
      intentLabel: "CHART_DETERMINISTIC: Vimshottari Mahadasha",
      answerText: `आपकी कुंडली में वर्तमान समय में विंशोत्तरी महादशा गणना:\n\n• सक्रिय महादशा (Active Mahadasha): ${kundli.currentDasha}\n• दशा चक्र प्रभाव: इस समयावधि में आपके जीवन के प्रमुख निर्णय और ऊर्जा मुख्य रूप से ${kundli.currentDasha} के कारकत्वों (स्वामित्व व प्रभाव) के अधीन गतिशील हैं।`,
      matchedRules: [CLASSICAL_RULES_DATABASE[0]],
      factsSummary: [
        `Current Dasha Lord: ${kundli.currentDasha}`,
        "Vimshottari 120-year cycle calculation",
      ],
    };
  }

  // 8. Chart-Specific: "Mera lucky gemstone kya hai?", "Konsa ratna pehne"
  if (q.includes("gemstone") || q.includes("ratna") || q.includes("stone")) {
    return {
      canAnswer: true,
      intentLabel: "CHART_DETERMINISTIC: Auspicious Gemstone",
      answerText: `आपकी लग्न (${kundli.lagna}) एवं लग्नेश (${kundli.lagnaLord}) के अनुसार आपका आधिकारिक जीवन रत्न:\n\n• अनुशंसित रत्न: ${kundli.luckyGemstone}\n• शुभ रंग: ${kundli.luckyColor}\n• धारण विधि: रत्न को संबंधित वार के प्रातःकाल कच्चे दूध व गंगाजल से शुद्ध कर मंत्र जप के साथ धारण करने का विधान है।`,
      matchedRules: [CLASSICAL_RULES_DATABASE[0]],
      factsSummary: [
        `Lagna: ${kundli.lagna}`,
        `Prescribed Gem: ${kundli.luckyGemstone}`,
      ],
    };
  }

  // Otherwise, needs tailored contextual synthesis (pass to pruner + RAG + Router)
  return {
    canAnswer: false,
    answerText: "",
    matchedRules: [],
    factsSummary: [],
    intentLabel: "REQUIRES_SYNTHESIS",
  };
}
