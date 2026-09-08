import type { ClassicalRuleCitation, AstrologyIntent } from "../../types";

export const CLASSICAL_RULES_DATABASE: ClassicalRuleCitation[] = [
  // --- CAREER / 10th HOUSE ---
  {
    id: "BPHS-18-2",
    sourceText: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 18: Judgement of Tenth House",
    verse: "Verse 2-4",
    sanskritSloka: "दशमेशे केन्द्रत्रिकोणगे बलयुते शुभदृष्टे राज्यलाभो भवति।",
    purport: "If the 10th lord occupies a Kendra (1st, 4th, 7th, 10th) or Trikona (5th, 9th) with planetary strength and is aspected by benefics, high administrative status, professional leadership, and sustained enterprise are conferred.",
    tags: ["career", "10th house", "kendra", "trikona", "karmadhipati", "leadership"],
  },
  {
    id: "PHALA-14-3",
    sourceText: "Phaladeepika",
    chapter: "Chapter 14: Results of Houses (Tenth Bhava)",
    verse: "Verse 3",
    sanskritSloka: "दशमे रवौ कुजे वा दिग्बलयुते बहुपराक्रमवान्।",
    purport: "Sun (Surya) or Mars (Mangal) situated in the 10th Bhava gains full Directional Strength (Digbala). The native achieves rapid professional elevation, triumph over competition, and authority in civic, engineering, or public governance.",
    tags: ["career", "digbala", "sun in 10th", "mars in 10th", "authority"],
  },
  {
    id: "SARAVALI-34-12",
    sourceText: "Saravali",
    chapter: "Chapter 34: Raja Yogas and Conjunctions",
    verse: "Verse 12",
    sanskritSloka: "कर्मेशे गुरुदृष्टे विपुलकीर्तिः धर्मकार्यप्रवृत्तिः।",
    purport: "When Jupiter (Guru) casts its 5th, 7th, or 9th aspect upon the 10th house or the 10th lord, career endeavors flourish with ethical repute, advisory prominence, and financial security during Jupiter's sub-periods.",
    tags: ["career", "jupiter aspect", "ethical enterprise", "mentorship"],
  },

  // --- MARRIAGE / 7th HOUSE ---
  {
    id: "BPHS-20-5",
    sourceText: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 20: Seventh House Effects & Kalatra Bhava",
    verse: "Verse 5",
    sanskritSloka: "सप्तमेशे स्वक्षेत्रगे शुभयुते सुशीला भार्या भवति।",
    purport: "When the 7th lord resides in its own sign or exaltation, associated with benefic Shukra or Guru, marital alliance is harmonious, culturally enriching, and mutually supportive.",
    tags: ["marriage", "7th house", "kalatra", "spouse harmony"],
  },
  {
    id: "BPHS-20-14-MANGLIK",
    sourceText: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 20: Kuja Dosha (Manglik) Determinants",
    verse: "Verse 14-16",
    sanskritSloka: "लग्ने व्यये च पाताले जामित्रे चाष्टमे कुजे। कन्याभर्तृविनाशः स्याद्भर्तुः कन्याविनाशनम्॥",
    purport: "If Mars occupies the 1st, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus, Mangal Dosha occurs. However, Mars in own sign (Mesha/Vrischika), exaltation (Makara), or association with Jupiter cancels malignant friction.",
    tags: ["manglik", "kuja dosha", "marriage timing", "mars cancellation"],
  },
  {
    id: "PHALA-10-8",
    sourceText: "Phaladeepika",
    chapter: "Chapter 10: Kalatra Yoga & Compatibility",
    verse: "Verse 8",
    sanskritSloka: "सप्तमे शुक्रे स्वोच्चे वा केन्द्रगे सुखप्रदः।",
    purport: "Venus (Shukra) placed in 7th or Kendra from Ascendant brings artistic temperament in marital life, affection, and flourishing partnership post-wedlock.",
    tags: ["marriage", "venus in 7th", "partnership"],
  },

  // --- WEALTH / 2nd & 11th HOUSE ---
  {
    id: "BPHS-41-1",
    sourceText: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 41: Special Dhana Yogas (Wealth)",
    verse: "Verse 1-3",
    sanskritSloka: "धनेशो लाभभावस्थो लाभेशो धनसंस्थितः। महाधनपतिर्भूत्वा राजा वा तत्समो भवेत्॥",
    purport: "Mutual exchange (Parivartana) between the 2nd lord (accumulated liquid wealth) and the 11th lord (gains & cashflow) forms the premier Maha Dhana Yoga, assuring inexhaustible prosperity.",
    tags: ["wealth", "dhana yoga", "2nd house", "11th house", "parivartana"],
  },
  {
    id: "JP-13-18",
    sourceText: "Jataka Parijata",
    chapter: "Chapter 13: Dhana and Labha Effects",
    verse: "Verse 18",
    sanskritSloka: "द्वितीये गुरुणा युक्ते वा दृष्टे धनाढ्यो भवति।",
    purport: "Jupiter in the 2nd house or aspecting the 2nd house shields against financial insolvency, blessing the family lineage with speech eloquence and enduring assets.",
    tags: ["wealth", "jupiter 2nd house", "speech", "savings"],
  },

  // --- HEALTH & DOSHAS / 6th & 8th HOUSE ---
  {
    id: "BPHS-42-12",
    sourceText: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 42: Vipareeta Raja Yoga",
    verse: "Verse 12-14",
    sanskritSloka: "रन्ध्रेशो षष्ठगो वापि षष्ठेशो रन्ध्रगो यदि। विपरीतराजयोगः स्यात्।",
    purport: "When lords of Dusthana houses (6th, 8th, 12th) occupy other Dusthana houses without association of Kendra lords, Vipareeta Raja Yoga forms—adversity transforms into sudden breakthrough.",
    tags: ["health", "vipareeta raja yoga", "6th house", "8th house", "breakthrough"],
  },
  {
    id: "SARAVALI-46-9",
    sourceText: "Saravali",
    chapter: "Chapter 46: Shani Sade Sati and Transits",
    verse: "Verse 9",
    sanskritSloka: "चन्द्रराशौ शनेश्चारे सप्तार्धवर्षपर्यन्तम् मनोक्लेशो भवति।",
    purport: "Saturn's 7.5-year transit through the 12th, 1st, and 2nd houses from natal Moon (Chandra) tests discipline, humility, and mental resilience. Its severe edge softens if Saturn is yoga-karaka for the Lagna.",
    tags: ["sade sati", "shani", "saturn transit", "discipline", "remedy"],
  },

  // --- NAKSHATRAS & CORE DEFINITIONS ---
  {
    id: "DEF-PURVA-PHALGUNI",
    sourceText: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 4: Nakshatra Attributes and Lords",
    verse: "Section 11",
    sanskritSloka: "पूर्वाफाल्गुन्यां जातः प्रियंवदो दानी सुभगो नृपसेवको भवति।",
    purport: "Purva Phalguni (13°20' to 26°40' Simha/Leo) is governed by Venus (Shukra) and presided by Bhaga, deity of fortune, prosperity, and delight. Natives possess charisma, fondness for music and arts, social magnetism, and refined speech.",
    tags: ["purva phalguni", "nakshatra", "bhaga", "venus"],
  },
  {
    id: "DEF-GAJAKESARI",
    sourceText: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 36: Auspicious Raja Yogas",
    verse: "Verse 3",
    sanskritSloka: "केन्द्रे देवगुरौ लग्नाच्चन्द्राद्वा यदि संस्थिते। गजकेसरी योगोऽयं ख्यातो बहुगुणान्वितः॥",
    purport: "When Jupiter is placed in a Kendra (1st, 4th, 7th, or 10th house) from the Moon or the Ascendant, Gajakesari Yoga is formed. It destroys thousands of doshas, granting intellect, lasting renown, and virtuous courage like an elephant-lion.",
    tags: ["gajakesari", "jupiter-moon", "raja yoga", "intellect", "fame"],
  },
  {
    id: "LAL-KITAB-SURYA-REMEDY",
    sourceText: "Lal Kitab",
    chapter: "Chapter 2: Surya Farman (Planetary Remedies)",
    verse: "Farman 14",
    sanskritSloka: "सूर्य अर्घ्यं च गायत्री जपम्।",
    purport: "Offering copper-pot Arghya with red sandalwood to the rising Surya alongside Gayatri Japa dispels self-doubt, fortifies vitality, and invokes administrative clarity without expensive gem purchases.",
    tags: ["remedy", "surya arghya", "gayatri", "lal kitab", "vitality"],
  },
];

export function retrieveClassicalEvidence(intent: AstrologyIntent, userQuestion: string): ClassicalRuleCitation[] {
  const q = userQuestion.toLowerCase();

  // Specific keyword direct matches
  if (q.includes("purva phalguni") || q.includes("phalguni")) {
    return CLASSICAL_RULES_DATABASE.filter((r) => r.id === "DEF-PURVA-PHALGUNI");
  }
  if (q.includes("gaj kesari") || q.includes("gajakesari")) {
    return CLASSICAL_RULES_DATABASE.filter((r) => r.id === "DEF-GAJAKESARI");
  }
  if (q.includes("sade sati") || q.includes("shani sade sati")) {
    return CLASSICAL_RULES_DATABASE.filter((r) => r.id === "SARAVALI-46-9");
  }
  if (q.includes("manglik") || q.includes("kuja dosha") || q.includes("mangal dosha")) {
    return CLASSICAL_RULES_DATABASE.filter((r) => r.id === "BPHS-20-14-MANGLIK");
  }

  // Intent-based retrieval
  switch (intent) {
    case "CAREER_10TH_HOUSE":
      return CLASSICAL_RULES_DATABASE.filter((r) => r.tags.includes("career"));
    case "MARRIAGE_7TH_HOUSE":
      return CLASSICAL_RULES_DATABASE.filter((r) => r.tags.includes("marriage"));
    case "WEALTH_2ND_11TH":
      return CLASSICAL_RULES_DATABASE.filter((r) => r.tags.includes("wealth"));
    case "HEALTH_6TH_8TH":
      return CLASSICAL_RULES_DATABASE.filter((r) => r.tags.includes("health"));
    case "DOSHA_REMEDY":
      return CLASSICAL_RULES_DATABASE.filter((r) => r.tags.includes("remedy") || r.tags.includes("manglik") || r.tags.includes("sade sati"));
    case "GENERAL_SHASTRA_DEF":
      return CLASSICAL_RULES_DATABASE.filter((r) => r.tags.includes("nakshatra") || r.tags.includes("gajakesari"));
    default:
      return [CLASSICAL_RULES_DATABASE[0], CLASSICAL_RULES_DATABASE[3]];
  }
}
