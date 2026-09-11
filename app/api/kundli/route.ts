import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { calculateVedicChartV1 } from "@/src/lib/vedicEngine/calculationEngine";
import { KundliRecordModel } from "@/src/lib/db/models";

// City coordinates database for India & major locations
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  delhi: { lat: 28.6139, lon: 77.209 },
  "new delhi": { lat: 28.6139, lon: 77.209 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  varanasi: { lat: 25.3176, lon: 82.9739 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  pune: { lat: 18.5204, lon: 73.8567 },
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  lucknow: { lat: 26.8467, lon: 80.9462 },
  kanpur: { lat: 26.4499, lon: 80.3319 },
  patna: { lat: 25.5941, lon: 85.1376 },
};

function parseTimeString(timeStr?: string): { hour: number; minute: number } {
  if (!timeStr) return { hour: 12, minute: 0 };
  const clean = timeStr.trim().toLowerCase();
  const isPM = clean.includes("pm");
  const isAM = clean.includes("am");
  const numbers = clean.replace(/[^0-9:]/g, "").split(":");
  let hour = parseInt(numbers[0] || "12", 10);
  const minute = parseInt(numbers[1] || "0", 10);
  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;
  return { hour, minute };
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, dob, tob, pob, userId } = body;

    if (!name || !dob) {
      return NextResponse.json(
        { error: "Name and Date of Birth required" },
        { status: 400 }
      );
    }

    const birthDate = new Date(dob);
    const day = birthDate.getDate() || 15;
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear() || 1998;
    const { hour, minute } = parseTimeString(tob);

    const cityKey = (pob || "Delhi").toLowerCase().trim();
    const matchedCoords =
      Object.entries(CITY_COORDINATES).find(([k]) => cityKey.includes(k))?.[1] || {
        lat: 28.6139,
        lon: 77.209,
      };

    const chartV1 = calculateVedicChartV1({
      name,
      year,
      month,
      day,
      hour,
      minute,
      latitude: matchedCoords.lat,
      longitude: matchedCoords.lon,
      timezoneOffsetHours: 5.5,
      cityName: pob || "New Delhi, India",
    });

    const moon = chartV1.planets.find((p) => p.name === "Moon")!;

    const luckyGemstone =
      chartV1.lagna.element === "Fire"
        ? "Ruby (Manikya) / Yellow Sapphire (Pukhraj)"
        : chartV1.lagna.element === "Earth"
        ? "Emerald (Panna) / Blue Sapphire"
        : chartV1.lagna.element === "Air"
        ? "Diamond / Opal"
        : "Pearl (Moti) / Red Coral";

    const luckyColor =
      chartV1.lagna.element === "Fire"
        ? "Saffron & Crimson"
        : chartV1.lagna.element === "Earth"
        ? "Emerald Green & Earthy Ochre"
        : chartV1.lagna.element === "Air"
        ? "Sky Blue & Silver"
        : "Pure White & Pearl";

    const luckyNumber = ((day + month) % 9) + 1;

    const formattedHouses = chartV1.houses.map((h) => ({
      house: h.house,
      sign: h.sign,
      signLord: h.signLord,
      planets: h.occupantPlanets.map((p) => p.split(" ")[0]),
      aspectedBy: h.aspectedByPlanets.map((p) => p.split(" ")[0]),
      significations: h.significations,
    }));

    // Non-blocking DB persistence
    if (isDbConnected()) {
      KundliRecordModel.create({
        userId: userId || "default_user",
        name,
        dob,
        tob: tob || "12:00 PM",
        pob: pob || "New Delhi, India",
        chartV1,
        provenance: chartV1.provenance,
      }).catch((e: any) =>
        console.warn("[MongoDB] Kundli persist notice:", e.message)
      );
    }

    return NextResponse.json({
      name,
      dob,
      tob: tob || "12:00 PM",
      pob: pob || "New Delhi, India",
      lagna: `${chartV1.lagna.rashi} (${chartV1.lagna.formattedDegree})`,
      lagnaLord: chartV1.lagna.rashiLord,
      element: chartV1.lagna.element,
      moonSign: `${moon.rashi} (${moon.formattedDegree})`,
      nakshatra: moon.nakshatra,
      nakshatraPada: moon.pada,
      nakshatraLord: moon.nakshatraLord,
      isManglik: chartV1.manglikStatus.isManglik,
      currentDasha: `${chartV1.dasha.currentMahadasha} Mahadasha`,
      currentAntardasha: chartV1.dasha.currentAntardasha,
      currentPratyantardasha: chartV1.dasha.currentPratyantardasha,
      luckyGemstone,
      luckyNumber,
      luckyColor,
      houses: formattedHouses,
      summary: chartV1.summary,
      chartV1,
      planetsDetailed: chartV1.planets,
      lagnaDetailed: chartV1.lagna,
      dashaTree: chartV1.dasha,
      provenance: chartV1.provenance,
    });
  } catch (error: any) {
    console.error("Kundli API error:", error);
    return NextResponse.json(
      { error: "Calculation failure", details: error.message },
      { status: 500 }
    );
  }
}
