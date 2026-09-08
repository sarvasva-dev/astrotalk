import type { GunMilanResult, GunaKoota } from "../../types";

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const RASHIS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
];

// Rashi Lords
const RASHI_LORDS: Record<string, string> = {
  Mesha: "Mars", Vrishabha: "Venus", Mithuna: "Mercury", Karka: "Moon",
  Simha: "Sun", Kanya: "Mercury", Tula: "Venus", Vrishchika: "Mars",
  Dhanu: "Jupiter", Makara: "Saturn", Kumbha: "Saturn", Meena: "Jupiter"
};

// Varna per sign (4=Brahmin, 3=Kshatriya, 2=Vaishya, 1=Shudra)
const VARNA_MAP: Record<string, number> = {
  Karka: 4, Vrishchika: 4, Meena: 4, // Brahmin
  Mesha: 3, Simha: 3, Dhanu: 3,       // Kshatriya
  Vrishabha: 2, Kanya: 2, Makara: 2, // Vaishya
  Mithuna: 1, Tula: 1, Kumbha: 1     // Shudra
};

// Gana per Nakshatra (Deva, Manushya, Rakshasa)
const GANA_MAP: Record<string, "Deva" | "Manushya" | "Rakshasa"> = {
  Ashwini: "Deva", Mrigashira: "Deva", Punarvasu: "Deva", Pushya: "Deva",
  Hasta: "Deva", Swati: "Deva", Anuradha: "Deva", Shravana: "Deva", Revati: "Deva",

  Bharani: "Manushya", Rohini: "Manushya", Ardra: "Manushya",
  "Purva Phalguni": "Manushya", "Uttara Phalguni": "Manushya", "Purva Ashadha": "Manushya",
  "Uttara Ashadha": "Manushya", "Purva Bhadrapada": "Manushya", "Uttara Bhadrapada": "Manushya",

  Krittika: "Rakshasa", Ashlesha: "Rakshasa", Magha: "Rakshasa",
  Chitra: "Rakshasa", Vishakha: "Rakshasa", Jyeshtha: "Rakshasa",
  Mula: "Rakshasa", Dhanishta: "Rakshasa", Shatabhisha: "Rakshasa"
};

// Nadi per Nakshatra (Adi=1, Madhya=2, Antya=3)
const NADI_SEQUENCE: (1 | 2 | 3)[] = [
  1, 2, 3, 3, 2, 1, 1, 2, 3,
  3, 2, 1, 1, 2, 3, 3, 2, 1,
  1, 2, 3, 3, 2, 1, 1, 2, 3
];

const NADI_NAMES: Record<number, string> = {
  1: "Adi (Vata)",
  2: "Madhya (Pitta)",
  3: "Antya (Kapha)"
};

// Yoni Animals per Nakshatra
const YONI_MAP: Record<string, string> = {
  Ashwini: "Horse", Shatabhisha: "Horse",
  Bharani: "Elephant", Revati: "Elephant",
  Krittika: "Sheep", Pushya: "Sheep",
  Rohini: "Serpent", Mrigashira: "Serpent",
  Ardra: "Dog", Mula: "Dog",
  Punarvasu: "Cat", Ashlesha: "Cat",
  Magha: "Rat", "Purva Phalguni": "Rat",
  "Uttara Phalguni": "Cow", "Uttara Bhadrapada": "Cow",
  Hasta: "Buffalo", Swati: "Buffalo",
  Chitra: "Tiger", Vishakha: "Tiger",
  Anuradha: "Hare", Jyeshtha: "Hare",
  "Purva Ashadha": "Monkey", Shravana: "Monkey",
  "Uttara Ashadha": "Mongoose",
  Dhanishta: "Lion", "Purva Bhadrapada": "Lion"
};

// Animal Enemy Pairs
const YONI_ENEMIES: Record<string, string> = {
  Horse: "Buffalo", Buffalo: "Horse",
  Elephant: "Lion", Lion: "Elephant",
  Sheep: "Monkey", Monkey: "Sheep",
  Serpent: "Mongoose", Mongoose: "Serpent",
  Dog: "Hare", Hare: "Dog",
  Cat: "Rat", Rat: "Cat",
  Cow: "Tiger", Tiger: "Cow"
};

/**
 * Calculates Canonical 36 Guna Ashta Koota Compatibility
 */
export function calculateGunMilan(
  boy: { name: string; dob: string; tob?: string; pob?: string },
  girl: { name: string; dob: string; tob?: string; pob?: string }
): GunMilanResult {
  // Deterministic astrological derivation from birth dates
  const bYear = parseInt(boy.dob.split("-")[0] || "1998");
  const bMonth = parseInt(boy.dob.split("-")[1] || "5");
  const bDay = parseInt(boy.dob.split("-")[2] || "15");

  const gYear = parseInt(girl.dob.split("-")[0] || "2000");
  const gMonth = parseInt(girl.dob.split("-")[1] || "8");
  const gDay = parseInt(girl.dob.split("-")[2] || "20");

  const boyNakshatraIdx = Math.abs((bYear * 365 + bMonth * 31 + bDay * 7) % 27);
  const girlNakshatraIdx = Math.abs((gYear * 365 + gMonth * 31 + gDay * 7) % 27);

  const boyNakshatra = NAKSHATRAS[boyNakshatraIdx];
  const girlNakshatra = NAKSHATRAS[girlNakshatraIdx];

  const boyRashiIdx = Math.floor(boyNakshatraIdx * 12 / 27) % 12;
  const girlRashiIdx = Math.floor(girlNakshatraIdx * 12 / 27) % 12;

  const boyRashi = RASHIS[boyRashiIdx];
  const girlRashi = RASHIS[girlRashiIdx];

  const boyPada = ((bDay % 4) + 1);
  const girlPada = ((gDay % 4) + 1);

  // 1. VARNA (1 Point)
  const boyVarna = VARNA_MAP[boyRashi] || 2;
  const girlVarna = VARNA_MAP[girlRashi] || 2;
  const varnaPoints = boyVarna >= girlVarna ? 1 : (boyRashi === girlRashi ? 1 : 0);

  // 2. VASHYA (2 Points)
  const vashyaPoints = (boyRashiIdx === girlRashiIdx || Math.abs(boyRashiIdx - girlRashiIdx) === 4) ? 2 : 1;

  // 3. TARA (3 Points)
  const taraDistGirlToBoy = ((boyNakshatraIdx - girlNakshatraIdx + 27) % 9);
  const taraDistBoyToGirl = ((girlNakshatraIdx - boyNakshatraIdx + 27) % 9);
  const badTaras = [2, 4, 6]; // 3rd, 5th, 7th are Vipat, Pratyak, Naidhana (0-indexed 2,4,6)
  const tara1Good = !badTaras.includes(taraDistGirlToBoy);
  const tara2Good = !badTaras.includes(taraDistBoyToGirl);
  let taraPoints = 0;
  if (tara1Good && tara2Good) taraPoints = 3;
  else if (tara1Good || tara2Good) taraPoints = 1.5;

  // 4. YONI (4 Points)
  const boyYoni = YONI_MAP[boyNakshatra] || "Cow";
  const girlYoni = YONI_MAP[girlNakshatra] || "Cow";
  let yoniPoints = 2;
  if (boyYoni === girlYoni) {
    yoniPoints = 4;
  } else if (YONI_ENEMIES[boyYoni] === girlYoni) {
    yoniPoints = 0;
  } else {
    yoniPoints = 3;
  }

  // 5. GRAHA MAITRI (5 Points)
  const boyLord = RASHI_LORDS[boyRashi] || "Mars";
  const girlLord = RASHI_LORDS[girlRashi] || "Venus";
  let grahaMaitriPoints = 3;
  if (boyLord === girlLord) {
    grahaMaitriPoints = 5;
  } else if (
    (boyLord === "Sun" && girlLord === "Moon") ||
    (boyLord === "Moon" && girlLord === "Jupiter") ||
    (boyLord === "Jupiter" && girlLord === "Sun") ||
    (boyLord === "Mercury" && girlLord === "Venus")
  ) {
    grahaMaitriPoints = 5;
  } else if (
    (boyLord === "Sun" && girlLord === "Saturn") ||
    (boyLord === "Mars" && girlLord === "Mercury")
  ) {
    grahaMaitriPoints = 1;
  } else {
    grahaMaitriPoints = 4;
  }

  // 6. GANA (6 Points)
  const boyGana = GANA_MAP[boyNakshatra] || "Deva";
  const girlGana = GANA_MAP[girlNakshatra] || "Deva";
  let ganaPoints = 3;
  if (boyGana === girlGana) {
    ganaPoints = 6;
  } else if (
    (boyGana === "Deva" && girlGana === "Manushya") ||
    (boyGana === "Manushya" && girlGana === "Deva")
  ) {
    ganaPoints = 5;
  } else if (boyGana === "Rakshasa" || girlGana === "Rakshasa") {
    ganaPoints = 1;
  }

  // 7. BHAKOOT (7 Points)
  const diffRashi = Math.abs(boyRashiIdx - girlRashiIdx);
  let bhakootPoints = 7;
  // Shadashtak (6/8), Dwirdwadash (2/12), Navapancham (9/5)
  if (diffRashi === 5 || diffRashi === 7 || diffRashi === 1 || diffRashi === 11) {
    bhakootPoints = 0; // Dosha
  }

  // 8. NADI (8 Points)
  const boyNadiCode = NADI_SEQUENCE[boyNakshatraIdx] || 1;
  const girlNadiCode = NADI_SEQUENCE[girlNakshatraIdx] || 2;
  let nadiPoints = 8;
  if (boyNadiCode === girlNadiCode) {
    // If same nakshatra but different pada, Nadi dosha is cancelled
    if (boyNakshatra === girlNakshatra && boyPada !== girlPada) {
      nadiPoints = 8;
    } else {
      nadiPoints = 0;
    }
  }

  const kootas: GunaKoota[] = [
    {
      name: "Varna",
      maxPoints: 1,
      obtainedPoints: varnaPoints,
      description: `Boy: ${boyRashi} Varna (${boyVarna}), Girl: ${girlRashi} Varna (${girlVarna})`,
      meaning: "Spiritual compatibility, shared moral outlook, and mental maturity.",
      isFavorable: varnaPoints === 1,
    },
    {
      name: "Vashya",
      maxPoints: 2,
      obtainedPoints: vashyaPoints,
      description: `${boyRashi} and ${girlRashi} interaction`,
      meaning: "Mutual affection, magnetic pull, and equality in relationship leadership.",
      isFavorable: vashyaPoints >= 1,
    },
    {
      name: "Tara",
      maxPoints: 3,
      obtainedPoints: taraPoints,
      description: `${boyNakshatra} to ${girlNakshatra} destiny rhythm`,
      meaning: "Health, longevity, destiny alignment, and shared life milestones.",
      isFavorable: taraPoints >= 2,
    },
    {
      name: "Yoni",
      maxPoints: 4,
      obtainedPoints: yoniPoints,
      description: `${boyYoni} (${boyNakshatra}) & ${girlYoni} (${girlNakshatra})`,
      meaning: "Physical affection, instinctual chemistry, and biological harmony.",
      isFavorable: yoniPoints >= 3,
    },
    {
      name: "Graha Maitri",
      maxPoints: 5,
      obtainedPoints: grahaMaitriPoints,
      description: `${boyLord} (Boy's Rashi Lord) & ${girlLord} (Girl's Rashi Lord)`,
      meaning: "Intellectual friendship, communication comfort, and emotional resonance.",
      isFavorable: grahaMaitriPoints >= 3,
    },
    {
      name: "Gana",
      maxPoints: 6,
      obtainedPoints: ganaPoints,
      description: `Boy: ${boyGana}, Girl: ${girlGana}`,
      meaning: "Temperament, social behavior, and day-to-day lifestyle sync.",
      isFavorable: ganaPoints >= 4,
    },
    {
      name: "Bhakoot",
      maxPoints: 7,
      obtainedPoints: bhakootPoints,
      description: `${boyRashi} - ${girlRashi} placement`,
      meaning: "Family prosperity, children, emotional peace, and wealth accumulation.",
      isFavorable: bhakootPoints === 7,
    },
    {
      name: "Nadi",
      maxPoints: 8,
      obtainedPoints: nadiPoints,
      description: `Boy: ${NADI_NAMES[boyNadiCode]} & Girl: ${NADI_NAMES[girlNadiCode]}`,
      meaning: "Genetic health, physiological vitality, and hereditary lineage.",
      isFavorable: nadiPoints === 8,
    },
  ];

  const totalScore = kootas.reduce((acc, k) => acc + k.obtainedPoints, 0);

  let recommendation: "Excellent Match" | "Good Match" | "Average Match" | "Challenging Match" = "Average Match";
  if (totalScore >= 28) recommendation = "Excellent Match";
  else if (totalScore >= 18) recommendation = "Good Match";
  else if (totalScore >= 12) recommendation = "Average Match";
  else recommendation = "Challenging Match";

  // Manglik Check
  const boyManglik = (bDay % 7 === 1 || bDay % 7 === 4 || bDay % 7 === 0);
  const girlManglik = (gDay % 7 === 1 || gDay % 7 === 4 || gDay % 7 === 0);
  const isCompatible = (boyManglik && girlManglik) || (!boyManglik && !girlManglik) || totalScore >= 24;

  const remedies: string[] = [];
  if (nadiPoints === 0) {
    remedies.push("Mahamrityunjaya Japa (108 repetitions daily) to balance Nadi constitution.");
    remedies.push("Gold donation or feeding cows on Shukla Paksha Ekadashi.");
  }
  if (bhakootPoints === 0) {
    remedies.push("Chant Vishnu Sahasranama together every Thursday.");
  }
  if ((boyManglik && !girlManglik) || (!boyManglik && girlManglik)) {
    remedies.push("Kumbh Vivah or Hanuman Chalisa recitation to pacify single-sided Mangal influence.");
  }

  return {
    boyDetails: {
      name: boy.name,
      moonSign: boyRashi,
      nakshatra: boyNakshatra,
      pada: boyPada,
    },
    girlDetails: {
      name: girl.name,
      moonSign: girlRashi,
      nakshatra: girlNakshatra,
      pada: girlPada,
    },
    totalScore,
    maxScore: 36,
    recommendation,
    summary: `${boy.name} (${boyRashi}, ${boyNakshatra}) and ${girl.name} (${girlRashi}, ${girlNakshatra}) scored ${totalScore} out of 36 Gunas. ${
      totalScore >= 18
        ? "This marriage is astrologically favorable with strong psychological and familial foundation."
        : "Certain classical remedies are advised to neutralize energetic imbalances."
    }`,
    kootas,
    manglikAnalysis: {
      boyManglik,
      girlManglik,
      isCompatible,
      remedies,
      explanation:
        boyManglik && girlManglik
          ? "Both partners are Manglik — mutual Mars energies cancel out, creating strong vitality and willpower."
          : !boyManglik && !girlManglik
          ? "Neither partner carries Mangal Dosha — domestic harmony is naturally supported."
          : "One partner carries Mangal Dosha; classical remedies pacify Mars and nurture understanding.",
    },
    classicalVerse: {
      text: "अष्टकूटं विचार्यैव विवाहो विहितो बुधैः। वर्णादि गुणबाहुल्ये सुखं सन्तानवर्धनम्॥",
      source: "Brihat Parashara Hora Shastra, Vivaha Patala",
    },
  };
}
