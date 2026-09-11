import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Wallet,
  Phone,
  MessageSquare,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  History,
  CheckCircle2,
} from "lucide-react";
import type { PageRoute, UserProfile, SavedKundli, PastSessionLog } from "../../types";
import { updateSEO } from "../../lib/seo";

interface UserProfilePageProps {
  initialTab?: "details" | "charts" | "history" | "ledger";
  userProfile: UserProfile;
  freeCredits: number;
  paidCredits: number;
  onUpdateProfile: (profile: UserProfile) => void;
  onOpenWallet: () => void;
  onNavigate: (route: PageRoute) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  initialTab = "details",
  userProfile,
  freeCredits,
  paidCredits,
  onUpdateProfile,
  onOpenWallet,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "charts" | "history" | "ledger">(initialTab);

  // Profile Form state
  const [displayName, setDisplayName] = useState(userProfile.displayName || "Astro Seeker");
  const [gender, setGender] = useState<"male" | "female" | "other">(userProfile.gender || "male");
  const [birthDate, setBirthDate] = useState(userProfile.birthDate || "1998-05-15");
  const [birthTime, setBirthTime] = useState(userProfile.birthTime || "14:30");
  const [birthPlace, setBirthPlace] = useState(userProfile.birthPlace || "New Delhi, India");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Saved Kundlis state
  const [savedKundlis, setSavedKundlis] = useState<SavedKundli[]>([
    {
      id: "chart_1",
      relation: "Self",
      name: userProfile.displayName || "Astro Seeker",
      gender: userProfile.gender || "male",
      dob: userProfile.birthDate || "1998-05-15",
      tob: userProfile.birthTime || "14:30",
      pob: userProfile.birthPlace || "New Delhi, India",
      moonSign: "Simha",
      lagna: "Kanya",
      savedAt: "2026-02-10",
    },
    {
      id: "chart_2",
      relation: "Spouse",
      name: "Pooja Sharma",
      gender: "female",
      dob: "2000-08-22",
      tob: "09:15",
      pob: "Jaipur, Rajasthan",
      moonSign: "Vrishabha",
      lagna: "Tula",
      savedAt: "2026-02-18",
    },
  ]);

  // Past Sessions log
  const pastSessions: PastSessionLog[] = [
    {
      id: "sess_1",
      type: "call",
      counsellorName: "Pratyuksha Trivedi",
      counsellorSlug: "pratyuksha",
      counsellorPortrait: "/portraits/pratyuksha.png",
      date: "Yesterday, 04:30 PM",
      durationMinutes: 5,
      amountCharged: 325,
      status: "completed",
    },
    {
      id: "sess_2",
      type: "chat",
      counsellorName: "Pt. Devrajit Sharma",
      counsellorSlug: "devrajit",
      counsellorPortrait: "/portraits/devrajit.png",
      date: "02 Mar 2026, 11:20 AM",
      durationMinutes: 4,
      amountCharged: 232,
      status: "completed",
    },
  ];

  // Ledger history
  const ledgerHistory = [
    {
      id: "tx_101",
      type: "Recharge",
      date: "05 Mar 2026",
      amount: "+ ₹500",
      paymentMethod: "Razorpay UPI",
      status: "Successful",
      bonus: "₹100 Extra",
    },
    {
      id: "tx_102",
      type: "Call Deduction",
      date: "04 Mar 2026",
      amount: "- ₹325",
      paymentMethod: "Pratyuksha Trivedi (5 mins)",
      status: "Completed",
      bonus: "-",
    },
    {
      id: "tx_103",
      type: "Recharge",
      date: "28 Feb 2026",
      amount: "+ ₹200",
      paymentMethod: "Razorpay Card",
      status: "Successful",
      bonus: "₹40 Extra",
    },
  ];

  useEffect(() => {
    updateSEO({
      title: "My Profile & Saved Kundli Charts — Astroguru",
      description: "Manage your birth details, saved family Kundlis, consultation history, and Razorpay wallet balance on Astroguru.",
      canonicalPath: "/profile",
    });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = {
      ...userProfile,
      displayName,
      gender,
      birthDate,
      birthTime,
      birthPlace,
    };
    
    // Optimistic UI update
    onUpdateProfile(updatedProfile);
    
    // Persist to database
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfile.id || "default_user",
          displayName,
          gender,
          birthDate,
          birthTime,
          birthPlace,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile to DB", err);
    }
  };

  return (
    <div className="w-full bg-[#fcfaf7] text-[#2c2416] pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#fae6cf] to-[#fcfaf7] border-b border-[#ebd7be] py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#c8531c] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1a140d]">
                {displayName}
              </h1>
              <p className="text-xs text-[#826a48] flex items-center gap-1.5 mt-0.5">
                <MapPin size={13} /> {birthPlace || "Location Not Set"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#fae6cf] border border-[#f3a76d] shadow-xs flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#fbf6e8] text-[#c8531c]">
                <Wallet size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#1b1612]">Wallet Balance</h3>
                <div className="text-xs text-[#786a55]">Free: {freeCredits} | Paid: {paidCredits}</div>
              </div>
            </div>
            <button
              onClick={onOpenWallet}
              className="px-4 py-2 rounded-lg bg-[#c8531c] text-white text-sm font-bold hover:bg-[#a64010] transition-colors"
            >
              Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#ebd7be] pb-3 mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "details"
                ? "bg-[#c8531c] text-white shadow-xs"
                : "bg-white text-[#614d33] hover:bg-[#fae6cf]/40 border border-[#ebd7be]"
            }`}
          >
            <User size={14} />
            <span>Birth Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("charts")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "charts"
                ? "bg-[#c8531c] text-white shadow-xs"
                : "bg-white text-[#614d33] hover:bg-[#fae6cf]/40 border border-[#ebd7be]"
            }`}
          >
            <Sparkles size={14} />
            <span>Saved Family Kundlis ({savedKundlis.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-[#c8531c] text-white shadow-xs"
                : "bg-white text-[#614d33] hover:bg-[#fae6cf]/40 border border-[#ebd7be]"
            }`}
          >
            <History size={14} />
            <span>Session History ({pastSessions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ledger")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "ledger"
                ? "bg-[#c8531c] text-white shadow-xs"
                : "bg-white text-[#614d33] hover:bg-[#fae6cf]/40 border border-[#ebd7be]"
            }`}
          >
            <CreditCard size={14} />
            <span>Transaction Ledger</span>
          </button>
        </div>

        {/* TAB 1: BIRTH PROFILE FORM */}
        {activeTab === "details" && (
          <div className="bg-white rounded-2xl border border-[#ebd7be] p-6 shadow-xs max-w-2xl">
            <h2 className="font-serif font-bold text-lg text-[#1a140d] mb-1">
              Your Astrological Birth Details
            </h2>
            <p className="text-xs text-[#826a48] mb-6">
              Used automatically to cast your Janma Kundli, D9 Navamsha, and transit alignments.
            </p>

            {savedSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Birth profile saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#826a48] font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#826a48] font-medium mb-1">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        gender === g
                          ? "border-[#c8531c] bg-[#fae6cf] text-[#85350f]"
                          : "border-[#ebd7be] bg-[#fcfaf7] text-[#614d33]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#826a48] font-medium mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#826a48] font-medium mb-1">Birth Time</label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#826a48] font-medium mb-1">Birth Place (City, State)</label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-[#fcfaf7]"
                  placeholder="e.g. New Delhi, India"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "kundli" })}
                  className="text-xs font-bold text-[#c8531c] hover:underline flex items-center gap-1"
                >
                  <span>Open Kundli with these details</span>
                  <ExternalLink size={13} />
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c8531c] hover:bg-[#a64013] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: SAVED FAMILY KUNDLIS */}
        {activeTab === "charts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-lg text-[#1a140d]">
                  Saved Family & Friends' Kundlis
                </h2>
                <p className="text-xs text-[#826a48]">
                  Quickly switch between charts during consultations without re-entering details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedKundlis.map((k) => (
                <div
                  key={k.id}
                  className="bg-white p-5 rounded-2xl border border-[#ebd7be] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-[#fae6cf] text-[#85350f] px-2 py-0.5 rounded-md">
                        {k.relation}
                      </span>
                      <span className="text-xs text-[#a48e71]">Saved {k.savedAt}</span>
                    </div>

                    <h3 className="font-bold text-base text-[#2c2416] mb-1">{k.name}</h3>
                    <div className="text-xs text-[#826a48] space-y-0.5 mb-3">
                      <div>DOB: {k.dob} at {k.tob}</div>
                      <div>POB: {k.pob}</div>
                      {k.moonSign && <div>Moon Sign: {k.moonSign} • Lagna: {k.lagna}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#ebd7be]">
                    <button
                      type="button"
                      onClick={() => onNavigate({ page: "kundli" })}
                      className="flex-1 py-2 bg-[#fae6cf] hover:bg-[#f3a76d] text-[#85350f] font-semibold text-xs rounded-xl transition-all text-center"
                    >
                      View Kundli
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SESSION HISTORY */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-[#ebd7be] p-6 shadow-xs">
            <h2 className="font-serif font-bold text-lg text-[#1a140d] mb-4">
              Past Consultation History
            </h2>

            <div className="divide-y divide-[#ebd7be]">
              {pastSessions.map((sess) => (
                <div key={sess.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={sess.counsellorPortrait}
                      alt={sess.counsellorName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-[#ebd7be]"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#2c2416]">
                        {sess.counsellorName}
                      </h4>
                      <div className="text-xs text-[#826a48] flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-[#c8531c]">
                          {sess.type === "call" ? <Phone size={12} /> : <MessageSquare size={12} />}
                          {sess.type.toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>{sess.date}</span>
                        <span>•</span>
                        <span>{sess.durationMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-[#2c2416]">
                      ₹{sess.amountCharged}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-medium">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TRANSACTION LEDGER */}
        {activeTab === "ledger" && (
          <div className="bg-white rounded-2xl border border-[#ebd7be] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-lg text-[#1a140d]">
                Wallet Transactions & Razorpay Invoices
              </h2>
              <button
                type="button"
                onClick={onOpenWallet}
                className="px-3 py-1.5 bg-[#c8531c] text-white font-bold text-xs rounded-xl"
              >
                + Recharge Wallet
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#ebd7be] text-[#826a48]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebd7be]">
                  {ledgerHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#fcfaf7]">
                      <td className="py-3 px-3 text-[#826a48]">{item.date}</td>
                      <td className="py-3 px-3 font-semibold text-[#2c2416]">{item.type}</td>
                      <td className="py-3 px-3 text-[#614d33]">{item.paymentMethod}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-bold ${
                          item.amount.startsWith("+") ? "text-emerald-700" : "text-[#c8531c]"
                        }`}
                      >
                        {item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
