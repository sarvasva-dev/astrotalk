import { useState, useEffect, useRef, useCallback } from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  Sparkles,
  Clock,
  Wallet,
  MessageSquare
} from "lucide-react";
import type { Counsellor, UserProfile } from "../types";

interface VoiceCallClientProps {
  counsellor: Counsellor;
  userProfile: UserProfile;
  walletBalance: number;
  onEndCall: () => void;
  onDeductBalance: (amount: number) => boolean;
  onOpenWallet: () => void;
  onSwitchToChat: () => void;
}

export default function VoiceCallClient({
  counsellor,
  userProfile,
  walletBalance,
  onEndCall,
  onDeductBalance,
  onOpenWallet,
  onSwitchToChat,
}: VoiceCallClientProps) {
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ended">("connecting");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [astrologerSpeaking, setAstrologerSpeaking] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState("");
  const [userSpokenText, setUserSpokenText] = useState("");
  const [waveform, setWaveform] = useState<number[]>([12, 24, 18, 32, 14, 28, 40, 22, 16, 30, 20, 15]);

  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Astrologer speech synthesis
  const speakAstrologerReply = useCallback((text: string) => {
    if (!("speechSynthesis" in window) || !isSpeaker) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = counsellor.name.includes("Pt.") || counsellor.name.includes("Acharya") ? 0.9 : 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes("en-IN") || v.lang.includes("hi-IN") || v.name.includes("India")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setAstrologerSpeaking(true);
    };
    utterance.onend = () => {
      setAstrologerSpeaking(false);
    };
    utterance.onerror = () => {
      setAstrologerSpeaking(false);
    };

    speechRef.current = utterance;
    setLastSpokenText(text);
    window.speechSynthesis.speak(utterance);
  }, [counsellor.name, isSpeaker]);

  // Connect call simulation
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setCallStatus("connected");
      const greeting = `Namaste ${userProfile.displayName ? userProfile.displayName.split(" ")[0] : "ji"}! Main ${counsellor.name} bol raha hoon. ${counsellor.signature} Batayein, aaj kis vishay par charcha karni hai?`;
      speakAstrologerReply(greeting);
    }, 2000);

    return () => {
      clearTimeout(connectTimer);
      window.speechSynthesis?.cancel();
    };
  }, [counsellor.name, counsellor.signature, userProfile.displayName, speakAstrologerReply]);

  // Call timer and billing
  useEffect(() => {
    if (callStatus !== "connected") return;

    const timer = setInterval(() => {
      setDuration((prev) => {
        const next = prev + 1;
        if (next > 0 && next % 60 === 0) {
          const success = onDeductBalance(counsellor.pricePerMin);
          if (!success) {
            speakAstrologerReply("Aapka balance khatam ho gaya hai. Shubh aashirwad.");
            setTimeout(() => {
              onEndCall();
            }, 3000);
          }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus, counsellor.pricePerMin, onDeductBalance, onEndCall, speakAstrologerReply]);

  // Dynamic waveform animation
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWaveform(
        Array.from({ length: 16 }, () =>
          astrologerSpeaking ? Math.floor(Math.random() * 38) + 12 : Math.floor(Math.random() * 8) + 6
        )
      );
    }, 120);

    return () => clearInterval(waveInterval);
  }, [astrologerSpeaking]);

  // Handle user asking question during call
  const handleUserConsult = async (queryText: string) => {
    setUserSpokenText(queryText);
    setAstrologerSpeaking(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: queryText }],
          counsellor: {
            slug: counsellor.slug,
            name: counsellor.name,
            specialties: counsellor.specialties,
            languages: counsellor.languages,
            experienceYears: counsellor.experienceYears,
            hometown: counsellor.hometown,
            personaPrompt: counsellor.personaPrompt,
            signature: counsellor.signature,
          },
          profile: userProfile,
        }),
      });

      const data = await res.json();
      const reply = data.text || "Namaste. Graha aapke paksh mein hain, kripya apna prashna punah poochein.";
      speakAstrologerReply(reply);
    } catch (err) {
      speakAstrologerReply("Sampark mein thoda avrodh hai, kripya dobara poochein.");
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const sampleQuestions = [
    "Kundli mein vivah yog kab hai?",
    "Career aur job change ka sahi samay?",
    "Shani Sade Sati ka koi shanti upaay?",
    "Mera aane wala samay kaisa rahega?",
  ];

  return (
    <div
      id="voice-call-screen"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-gradient-to-b from-[#1b1612] via-[#241c16] to-[#0f0c09] text-[#f6efdc] p-6 select-none"
    >
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1f5f5b] animate-pulse" />
          <span className="text-xs tracking-wider uppercase font-mono text-[#d9cda7]">
            {callStatus === "connecting" ? "Establishing line..." : "Astrotalk Voice HD"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fae6cf]/10 border border-[#f3a76d]/40 text-xs font-semibold text-[#f3a76d] cursor-pointer"
          >
            <Wallet size={12} />
            <span>₹{walletBalance}</span>
          </button>

          <button
            type="button"
            onClick={onSwitchToChat}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#f6efdc] transition-colors cursor-pointer"
            title="Switch to Chat"
          >
            <MessageSquare size={16} />
          </button>
        </div>
      </header>

      {/* Main Astrologer Section */}
      <main className="flex flex-col items-center justify-center text-center my-auto">
        {/* Pulsing Aura & Portrait */}
        <div className="relative mb-6">
          <div
            className={`absolute -inset-4 rounded-full border border-[#c8531c]/30 transition-all duration-700 ${
              astrologerSpeaking ? "scale-115 opacity-70 animate-ping" : "opacity-30"
            }`}
          />
          <div
            className={`absolute -inset-8 rounded-full border border-[#b8860b]/20 transition-all duration-1000 ${
              astrologerSpeaking ? "scale-120 opacity-50" : "opacity-15"
            }`}
          />

          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-[#d9cda7] shadow-2xl bg-[#3d342a]">
            <img
              src={counsellor.portrait}
              alt={counsellor.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name and credentials */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#fbf6e8]">
            {counsellor.name}
          </h2>
          <ShieldCheck size={20} className="text-[#3f8a82]" />
        </div>

        <p className="text-xs sm:text-sm text-[#a89a7d] mb-4">
          {counsellor.specialties.slice(0, 3).join(" • ")} • ₹{counsellor.pricePerMin}/min
        </p>

        {/* Call Status & Timer */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          <Clock size={14} className="text-[#c8531c]" />
          <span className="font-mono text-sm tracking-wider font-semibold">
            {callStatus === "connecting" ? "Connecting..." : formatTimer(duration)}
          </span>
        </div>

        {/* Waveform Visualizer */}
        <div className="flex items-center gap-1.5 h-12 mb-6">
          {waveform.map((h, i) => (
            <div
              key={i}
              className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 ${
                astrologerSpeaking ? "bg-[#c8531c]" : "bg-[#a89a7d]/50"
              }`}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Astrologer dialogue transcript */}
        {lastSpokenText && (
          <div className="max-w-md px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-[#f6efdc]/90 italic font-display leading-relaxed line-clamp-3">
            &ldquo;{lastSpokenText}&rdquo;
          </div>
        )}

        {/* User spoken transcript */}
        {userSpokenText && (
          <div className="mt-2 text-xs text-[#a89a7d]">
            You asked: &ldquo;{userSpokenText}&rdquo;
          </div>
        )}

        {/* Quick Consultation Topics */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-lg">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleUserConsult(q)}
              className="text-xs bg-white/5 hover:bg-[#c8531c]/30 border border-white/10 hover:border-[#c8531c] text-[#d9cda7] px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </main>

      {/* Call Controls Footer */}
      <footer className="flex items-center justify-center gap-6 sm:gap-8 pb-4">
        {/* Mute Button */}
        <button
          id="btn-call-mute"
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-full transition-all cursor-pointer ${
            isMuted
              ? "bg-[#a8231a] text-white"
              : "bg-white/10 hover:bg-white/20 text-[#f6efdc]"
          }`}
          title={isMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        {/* End Call Button */}
        <button
          id="btn-call-hangup"
          type="button"
          onClick={() => {
            window.speechSynthesis?.cancel();
            onEndCall();
          }}
          className="p-5 rounded-full bg-[#a8231a] hover:bg-[#851810] text-white shadow-xl shadow-red-900/40 transition-transform active:scale-95 cursor-pointer"
          title="End Call"
        >
          <PhoneOff size={28} />
        </button>

        {/* Speaker Button */}
        <button
          id="btn-call-speaker"
          type="button"
          onClick={() => {
            if (isSpeaker) {
              window.speechSynthesis?.cancel();
            }
            setIsSpeaker(!isSpeaker);
          }}
          className={`p-4 rounded-full transition-all cursor-pointer ${
            !isSpeaker
              ? "bg-[#a8231a] text-white"
              : "bg-white/10 hover:bg-white/20 text-[#f6efdc]"
          }`}
          title={isSpeaker ? "Mute Speaker" : "Turn On Speaker"}
        >
          {isSpeaker ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </button>
      </footer>
    </div>
  );
}
