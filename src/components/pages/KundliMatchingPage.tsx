import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Award,
  ChevronRight,
  BookOpen,
  Info,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
} from "lucide-react";
import type { PageRoute, GunMilanResult } from "../../types";
import { calculateGunMilan } from "../../lib/vedicEngine/gunMilanEngine";
import { updateSEO } from "../../lib/seo";

interface KundliMatchingPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const KundliMatchingPage: React.FC<KundliMatchingPageProps> = ({ onNavigate }) => {
  const [boyName, setBoyName] = useState("Aarav Sharma");
  const [boyDob, setBoyDob] = useState("1996-04-14");
  const [boyTob, setBoyTob] = useState("06:30");
  const [boyPob, setBoyPob] = useState("Delhi, India");

  const [girlName, setGirlName] = useState("Diya Verma");
  const [girlDob, setGirlDob] = useState("1998-08-22");
  const [girlTob, setGirlTob] = useState("14:15");
  const [girlPob, setGirlPob] = useState("Jaipur, Rajasthan");

  const [result, setResult] = useState<GunMilanResult | null>(null);

  useEffect(() => {
    updateSEO({
      title: "Kundli Matching (Gun Milan) Online: 36 Gunas & Manglik Report — Astroguru",
      description: "Free Kundli Matching for Marriage. Check 36 Guna Ashta Koota score (Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, Nadi) and Manglik Dosha compatibility on Astroguru.",
      canonicalPath: "/kundli-matching",
      keywords: [
        "kundli matching",
        "gun milan",
        "36 gunas",
        "marriage compatibility",
        "ashta koota",
        "nadi dosha",
        "bhakoot dosha",
        "manglik check",
      ],
    });

    // Run initial calculation
    handleCalculate();
  }, []);

  const handleCalculate = () => {
    if (!boyDob || !girlDob) return;
    const res = calculateGunMilan(
      { name: boyName || "Boy", dob: boyDob, tob: boyTob, pob: boyPob },
      { name: girlName || "Girl", dob: girlDob, tob: girlTob, pob: girlPob }
    );
    setResult(res);
  };

  const loadSampleCouple = (scenario: "good" | "nadi") => {
    if (scenario === "good") {
      setBoyName("Aarav Sharma");
      setBoyDob("1996-04-14");
      setGirlName("Diya Verma");
      setGirlDob("1998-08-22");
    } else {
      setBoyName("Rohan Mehta");
      setBoyDob("1995-10-18");
      setGirlName("Pooja Joshi");
      setGirlDob("1997-12-05");
    }
    setTimeout(() => handleCalculate(), 50);
  };

  return (
    <div className="w-full bg-[#fcfaf7] text-[#2c2416] pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#fae6cf] to-[#fcfaf7] border-b border-[#ebd7be] py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake size={14} />
            <span>Ashta Koota Vedic Gun Milan</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1a140d] mb-2">
            Kundli Matching for Marriage
          </h1>
          <p className="text-xs sm:text-sm text-[#614d33] max-w-xl mx-auto">
            Evaluate psychological, emotional, financial, and physical harmony across 36 classical Gunas based on lunar constellations (Janma Nakshatras).
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* INPUT FORMS: Boy and Girl */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Boy's Details */}
          <div className="bg-white p-5 rounded-2xl border border-[#ebd7be] shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#ebd7be]">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                ♂
              </div>
              <h2 className="font-bold text-sm text-[#2c2416]">Groom's (Boy's) Details</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#826a48] font-medium mb-1">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-[#a48e71]" />
                  <input
                    type="text"
                    value={boyName}
                    onChange={(e) => setBoyName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                    placeholder="Boy's Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#826a48] font-medium mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={boyDob}
                    onChange={(e) => setBoyDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="block text-[#826a48] font-medium mb-1">Birth Time</label>
                  <input
                    type="time"
                    value={boyTob}
                    onChange={(e) => setBoyTob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#826a48] font-medium mb-1">Birth Place</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-[#a48e71]" />
                  <input
                    type="text"
                    value={boyPob}
                    onChange={(e) => setBoyPob(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                    placeholder="City, State, Country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Girl's Details */}
          <div className="bg-white p-5 rounded-2xl border border-[#ebd7be] shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#ebd7be]">
              <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                ♀
              </div>
              <h2 className="font-bold text-sm text-[#2c2416]">Bride's (Girl's) Details</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#826a48] font-medium mb-1">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-[#a48e71]" />
                  <input
                    type="text"
                    value={girlName}
                    onChange={(e) => setGirlName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                    placeholder="Girl's Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#826a48] font-medium mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={girlDob}
                    onChange={(e) => setGirlDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="block text-[#826a48] font-medium mb-1">Birth Time</label>
                  <input
                    type="time"
                    value={girlTob}
                    onChange={(e) => setGirlTob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#826a48] font-medium mb-1">Birth Place</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-[#a48e71]" />
                  <input
                    type="text"
                    value={girlPob}
                    onChange={(e) => setGirlPob(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                    placeholder="City, State, Country"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#826a48]">Quick Samples:</span>
            <button
              type="button"
              onClick={() => loadSampleCouple("good")}
              className="px-2.5 py-1 bg-white border border-[#ebd7be] hover:border-[#c8531c] rounded-lg text-[#614d33]"
            >
              Couple A (28+ Gunas)
            </button>
            <button
              type="button"
              onClick={() => loadSampleCouple("nadi")}
              className="px-2.5 py-1 bg-white border border-[#ebd7be] hover:border-[#c8531c] rounded-lg text-[#614d33]"
            >
              Couple B (Nadi Check)
            </button>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="px-6 py-2.5 bg-[#c8531c] hover:bg-[#a64013] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-1.5"
          >
            <Sparkles size={15} />
            <span>Calculate 36 Gunas</span>
          </button>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="space-y-6">
            {/* Score Overview Banner */}
            <div className="bg-white rounded-2xl border border-[#ebd7be] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#ebd7be]">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c8531c]">
                    Total Compatibility Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl sm:text-5xl font-bold font-serif text-[#1a140d]">
                      {result.totalScore}
                    </span>
                    <span className="text-lg text-[#826a48] font-medium">/ 36 Gunas</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        result.totalScore >= 28
                          ? "bg-emerald-100 text-emerald-800"
                          : result.totalScore >= 18
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {result.recommendation} (Minimum recommended: 18)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-[#fcfaf7] p-4 rounded-xl border border-[#ebd7be]">
                  <div>
                    <span className="text-[#826a48] block">Groom:</span>
                    <span className="font-bold text-[#2c2416]">{result.boyDetails.name}</span>
                    <div className="text-[11px] text-[#614d33]">
                      {result.boyDetails.moonSign} • {result.boyDetails.nakshatra} (Pada {result.boyDetails.pada})
                    </div>
                  </div>
                  <div>
                    <span className="text-[#826a48] block">Bride:</span>
                    <span className="font-bold text-[#2c2416]">{result.girlDetails.name}</span>
                    <div className="text-[11px] text-[#614d33]">
                      {result.girlDetails.moonSign} • {result.girlDetails.nakshatra} (Pada {result.girlDetails.pada})
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#614d33] leading-relaxed pt-4">
                {result.summary}
              </p>
            </div>

            {/* Ashta Koota 8 Points Breakdown Table */}
            <div className="bg-white rounded-2xl border border-[#ebd7be] p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#1a140d] mb-4 flex items-center justify-between">
                <span>Ashta Koota 36 Gunas Table</span>
                <span className="text-xs font-normal text-[#826a48]">Classical Parashari System</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#ebd7be] text-[#826a48]">
                      <th className="py-2.5 px-3">Koota</th>
                      <th className="py-2.5 px-3">Area of Life</th>
                      <th className="py-2.5 px-3 text-center">Max</th>
                      <th className="py-2.5 px-3 text-center">Score</th>
                      <th className="py-2.5 px-3">Evaluation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebd7be]">
                    {result.kootas.map((k, idx) => (
                      <tr key={idx} className="hover:bg-[#fcfaf7]">
                        <td className="py-3 px-3 font-bold text-[#2c2416]">
                          {idx + 1}. {k.name}
                        </td>
                        <td className="py-3 px-3 text-[#614d33] max-w-xs">{k.meaning}</td>
                        <td className="py-3 px-3 text-center font-semibold text-[#826a48]">{k.maxPoints}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-md ${
                              k.obtainedPoints === k.maxPoints
                                ? "bg-emerald-100 text-emerald-800"
                                : k.obtainedPoints > 0
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {k.obtainedPoints}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#614d33]">{k.description}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#ebd7be] font-bold">
                      <td colSpan={2} className="py-3 px-3 text-[#1a140d]">
                        Total Ashta Koota Score
                      </td>
                      <td className="py-3 px-3 text-center text-[#826a48]">36</td>
                      <td className="py-3 px-3 text-center text-base text-[#c8531c]">
                        {result.totalScore}
                      </td>
                      <td className="py-3 px-3 text-xs text-[#826a48]">
                        {result.recommendation}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Manglik Dosha Analysis */}
            <div className="bg-white rounded-2xl border border-[#ebd7be] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={20} className="text-[#c8531c]" />
                <h3 className="font-serif text-base font-bold text-[#1a140d]">
                  Manglik Dosha Compatibility
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#fcfaf7] border border-[#ebd7be]">
                  <span className="text-[#826a48] block mb-1">{result.boyDetails.name}:</span>
                  <span className={`font-bold ${result.manglikAnalysis.boyManglik ? "text-red-600" : "text-emerald-700"}`}>
                    {result.manglikAnalysis.boyManglik ? "⚠ Manglik Present" : "✓ Non-Manglik"}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#fcfaf7] border border-[#ebd7be]">
                  <span className="text-[#826a48] block mb-1">{result.girlDetails.name}:</span>
                  <span className={`font-bold ${result.manglikAnalysis.girlManglik ? "text-red-600" : "text-emerald-700"}`}>
                    {result.manglikAnalysis.girlManglik ? "⚠ Manglik Present" : "✓ Non-Manglik"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#614d33] leading-relaxed mb-4">
                {result.manglikAnalysis.explanation}
              </p>

              {result.manglikAnalysis.remedies.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block mb-1.5">
                    Classical Shastric Remedies Recommended:
                  </span>
                  <ul className="space-y-1 text-amber-800 list-disc list-inside">
                    {result.manglikAnalysis.remedies.map((rem, i) => (
                      <li key={i}>{rem}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Consult Astrologer CTA */}
            <div className="bg-gradient-to-r from-[#fae6cf] to-[#ebd7be] rounded-2xl p-6 border border-[#f3a76d] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-base text-[#1a140d]">
                  Discuss this compatibility report with a Senior Astrologer
                </h4>
                <p className="text-xs text-[#614d33] mt-0.5">
                  Get personalized remedies, Muhurat dates, and family alignment guidance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate({ page: "consult", category: "marriage" })}
                className="px-5 py-2.5 bg-[#c8531c] hover:bg-[#a64013] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <Phone size={14} />
                <span>Talk to Marriage Astrologer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
