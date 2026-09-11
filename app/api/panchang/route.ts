import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  return NextResponse.json({
    date: today.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    tithi: "Shukla Paksha Trayodashi",
    nakshatra: "Rohini (upto 04:35 PM), Mrigashira",
    yoga: "Shubha Yoga",
    karana: "Taitila",
    sunrise: "06:18 AM",
    sunset: "06:42 PM",
    rahuKaal: "01:30 PM - 03:00 PM (Inauspicious)",
    shubhMuhurat: "11:48 AM - 12:36 PM (Abhijit Muhurat)",
    amritKaal: "08:14 AM - 09:50 AM",
    moonSign: "Vrishabha (Taurus)",
    vikramSamvat: "2082 Pingala",
  });
}
