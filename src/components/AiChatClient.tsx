import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Send,
  Phone,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ShieldCheck,
  Check,
  Square,
  Clock,
  Wallet,
  Cpu,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  Coins
} from "lucide-react";
import type { Counsellor, UserProfile, ChatMessage, KundliData, OrchestratorTrace } from "../types";
import { executeOrchestratorPipeline } from "../lib/orchestrator/orchestrator";
import { AICreditManager } from "../lib/orchestrator/creditManager";

interface AiChatClientProps {
  counsellor: Counsellor;
  userProfile: UserProfile;
  kundli: KundliData | null;
  walletBalance: number;
  onBack: () => void;
  onStartCall: (c: Counsellor) => void;
  onDeductBalance: (amount: number) => boolean;
  onOpenWallet: () => void;
  onOpenOrchestrator: (trace?: OrchestratorTrace) => void;
}

export default function AiChatClient({
  counsellor,
  userProfile,
  kundli,
  walletBalance,
  onBack,
  onStartCall,
  onDeductBalance,
  onOpenWallet,
  onOpenOrchestrator,
}: AiChatClientProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome-1",
      role: "assistant",
      content: `Pranam ${userProfile.displayName ? userProfile.displayName.split(" ")[0] : "ji"}! Main ${counsellor.name} hoon. ${counsellor.signature} Aapke man mein vivah, career, ya graha dosha ko lekar jo bhi prashna hai, be-jhijhak poochein.`,
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechActiveId, setSpeechActiveId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [creditProfile, setCreditProfile] = useState(AICreditManager.getProfile);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Session timer & per-minute billing
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration((prev) => {
        const next = prev + 1;
        if (next > 0 && next % 60 === 0) {
          const success = onDeductBalance(counsellor.pricePerMin);
          if (!success) {
            setMessages((m) => [
              ...m,
              {
                id: `system-${Date.now()}`,
                role: "assistant",
                content: "Aapka wallet balance samaapt ho chuka hai. Kripya chat jaari rakhne ke liye wallet recharge karein.",
                timestamp: Date.now(),
              },
            ]);
          }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [counsellor.pricePerMin, onDeductBalance]);

  // Speech Recognition for voice typing
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "hi-IN";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. You can type your question directly.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const togglePlayAudio = (messageId: string, text: string) => {
    if (!("speechSynthesis" in window)) return;

    if (speechActiveId === messageId) {
      window.speechSynthesis.cancel();
      setSpeechActiveId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = counsellor.name.includes("Pt.") || counsellor.name.includes("Acharya") ? 0.9 : 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes("en-IN") || v.lang.includes("hi-IN") || v.name.includes("India")
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setSpeechActiveId(null);
    utterance.onerror = () => setSpeechActiveId(null);

    setSpeechActiveId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || input).trim();
    if (!content || isTyping) return;

    if (walletBalance < counsellor.pricePerMin && sessionDuration > 30) {
      onOpenWallet();
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Execute the AI Orchestrator Pipeline:
      // Deterministic check -> Targeted Pruning -> Classical Evidence RAG -> Quota-Aware Router -> Fact Verification
      const pipelineResult = await executeOrchestratorPipeline(
        content,
        counsellor,
        userProfile,
        kundli,
        async (payload) => {
          // LLM Call on server
          const payloadMessages = [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          }));

          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: payloadMessages,
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
              prunedFacts: payload.prunedChartFacts,
              matchedRules: payload.matchedRules,
            }),
          });

          const data = await res.json();
          return data.text || "Namaste. Graha aapke paksh mein hain.";
        }
      );

      // Record transaction & update credit ledger
      const updatedCredits = AICreditManager.recordTransaction(pipelineResult.trace);
      setCreditProfile(updatedCredits);

      const assistantMessage: ChatMessage = {
        id: `astrologer-${Date.now()}`,
        role: "assistant",
        content: pipelineResult.replyText,
        timestamp: Date.now(),
        trace: pipelineResult.trace,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (pipelineResult.replyText.length < 180) {
        togglePlayAudio(assistantMessage.id, pipelineResult.replyText);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Kshama karein, sampark mein thoda vilamb hua. Kripya apna prashna punah poochein.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const quickQuestions = [
    "Purva Phalguni kya hota hai?",
    "Career kaisa rahega?",
    "Manglik dosha hai kya?",
    "Sade Sati kya hoti hai?",
    "Meri lagna kya hai?",
  ];

  return (
    <div id="ai-chat-view" className="flex flex-col h-full bg-[#f6efdc]">
      {/* Astrologer Chat Header */}
      <header className="shrink-0 bg-[#fbf6e8] border-b border-[#c9b884] p-3 px-4 shadow-xs z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              id="btn-chat-back"
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-[#ebe2c8] text-[#1b1612] transition-colors cursor-pointer"
              title="Back to Astrologers"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c9b884] bg-[#ece4cb]">
                <img
                  src={counsellor.portrait}
                  alt={counsellor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1f5f5b] border-2 border-[#fbf6e8]" />
            </div>

            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-display font-bold text-sm text-[#1b1612] leading-tight">
                  {counsellor.name}
                </h3>
                <ShieldCheck size={14} className="text-[#1f5f5b]" />
              </div>
              <p className="text-[11px] text-[#786a55] flex items-center gap-1.5">
                <span className="text-[#1f5f5b] font-medium">Online</span>
                <span>•</span>
                <span>₹{counsellor.pricePerMin}/min</span>
              </p>
            </div>
          </div>

          {/* Right Header Controls: Pipeline HUD button, Session Timer, Wallet, Call */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenOrchestrator()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1410] border border-[#d97706]/40 text-xs text-[#fbbf24] hover:bg-[#261d16] transition-all cursor-pointer shadow-xs"
              title="Inspect AI Orchestrator & Evidence Pipeline"
            >
              <Cpu size={13} className="text-[#fbbf24] animate-pulse" />
              <span className="font-bold">AI Orchestrator</span>
              <span className="px-1.5 py-0.2 rounded bg-[#d97706]/30 font-mono text-[10px] text-white">
                {creditProfile.creditsRemaining} cr
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ebe2c8] border border-[#d9cda7] text-xs font-mono text-[#3d342a]">
              <Clock size={12} className="text-[#c8531c]" />
              <span>{formatTimer(sessionDuration)}</span>
            </div>

            <button
              id="chat-header-wallet-btn"
              type="button"
              onClick={onOpenWallet}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fae6cf] border border-[#f3a76d] text-xs font-semibold text-[#5e2308] hover:bg-[#f3a76d]/30 transition-colors cursor-pointer"
            >
              <Wallet size={13} className="text-[#c8531c]" />
              <span>₹{walletBalance}</span>
            </button>

            <button
              id="btn-switch-to-call"
              type="button"
              onClick={() => onStartCall(counsellor)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1f5f5b] hover:bg-[#184d4a] text-white text-xs font-semibold px-3 py-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Phone size={13} />
              <span className="hidden sm:inline">Call</span>
            </button>
          </div>
        </div>
      </header>

      {/* Birth Chart Context & Pipeline Status Bar */}
      <div className="bg-[#ebe2c8]/70 border-b border-[#e6d9b7] py-1.5 px-4 text-xs text-[#786a55]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <Sparkles size={13} className="text-[#c8531c] shrink-0" />
            <span className="truncate">
              Kundli: <strong className="text-[#1b1612]">{userProfile.displayName || "Client"}</strong>
              {kundli ? ` (${kundli.lagna} Lagna • ${kundli.moonSign} Rashi)` : " (Loaded)"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenOrchestrator()}
            className="shrink-0 text-[11px] text-[#c8531c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Cpu size={12} />
            <span>Telemetry Pipeline</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          const isPlaying = speechActiveId === msg.id;
          const isTraceExpanded = expandedTraceId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed shadow-xs transition-all ${
                  isUser
                    ? "bg-[#c8531c] text-white rounded-tr-xs"
                    : "bg-[#fbf6e8] text-[#1b1612] border border-[#e6d9b7] rounded-tl-xs"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[#e6d9b7]/60">
                    <span className="font-display font-semibold text-xs text-[#c8531c]">
                      {counsellor.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePlayAudio(msg.id, msg.content)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#786a55] hover:text-[#1b1612] transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <Square size={11} className="text-[#a8231a] fill-current" />
                          <span className="text-[#a8231a] font-medium">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} className="text-[#1f5f5b]" />
                          <span>Voice Note</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Evidence & Telemetry Inspector Pill for Assistant messages */}
                {!isUser && msg.trace && (
                  <div className="mt-3 pt-2.5 border-t border-[#e6d9b7]/70">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Provider tag */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                            msg.trace.isDeterministic || msg.trace.routeDecision.providerName === "Deterministic Engine"
                              ? "bg-[#10b981]/15 text-[#047857] border border-[#10b981]/30"
                              : msg.trace.routeDecision.providerName === "Sarvam Synthesizer"
                              ? "bg-[#f59e0b]/15 text-[#b45309] border border-[#f59e0b]/30"
                              : "bg-[#3b82f6]/15 text-[#1d4ed8] border border-[#3b82f6]/30"
                          }`}
                        >
                          {msg.trace.isDeterministic ? "⚡ Deterministic" : msg.trace.routeDecision.providerName}
                          <span className="opacity-75">({msg.trace.routeDecision.creditsCharged} cr)</span>
                        </span>

                        {/* Token savings badge */}
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1f5f5b]/10 text-[#1f5f5b]">
                          -{msg.trace.tokensSavedPercentage}% tok
                        </span>

                        {/* Fact checked badge */}
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#047857]">
                          <CheckCircle2 size={11} />
                          Verified
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedTraceId(isTraceExpanded ? null : msg.id)}
                        className="text-[10px] text-[#786a55] hover:text-[#c8531c] flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <BookOpen size={11} />
                        <span>{isTraceExpanded ? "Hide Shastra" : "View Shastra Evidence"}</span>
                        {isTraceExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>

                    {/* Expandable Shastra citations panel */}
                    {isTraceExpanded && (
                      <div className="mt-2 p-2.5 rounded-lg bg-[#faebd7]/70 border border-[#e6d9b7] text-[11px] space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between text-[#5e2308] font-semibold text-[10px] uppercase tracking-wider">
                          <span>Matched Classical Shastra Citations:</span>
                          <button
                            type="button"
                            onClick={() => onOpenOrchestrator(msg.trace)}
                            className="text-[#c8531c] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Cpu size={10} />
                            Full Trace & Pools
                          </button>
                        </div>
                        {msg.trace.matchedRules.map((rule, rIdx) => (
                          <div key={rIdx} className="bg-[#fbf6e8] p-2 rounded border border-[#d9cda7]/60">
                            <div className="font-bold text-[#c8531c] text-[11px]">
                              {rule.sourceText} — {rule.chapter} ({rule.verse})
                            </div>
                            {rule.sanskritSloka && (
                              <div className="font-serif italic text-[#3d342a] my-0.5 text-[11px]">
                                &ldquo;{rule.sanskritSloka}&rdquo;
                              </div>
                            )}
                            <div className="text-[10px] text-[#786a55]">
                              {rule.purport}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                    isUser ? "text-white/70" : "text-[#a89a7d]"
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isUser && <Check size={12} className="text-white/80" />}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#786a55] italic bg-[#fbf6e8] border border-[#e6d9b7] p-2.5 px-4 rounded-xl w-fit shadow-xs animate-pulse">
            <Sparkles size={14} className="text-[#c8531c] animate-spin" />
            <span>AI Orchestrator: Shastra matching & deterministic engine checking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length < 5 && (
        <div className="shrink-0 p-2 px-4 max-w-4xl mx-auto w-full overflow-x-auto no-scrollbar flex items-center gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="shrink-0 text-xs bg-[#fbf6e8] border border-[#d9cda7] hover:border-[#c8531c] hover:bg-[#fae6cf] text-[#3d342a] px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <footer className="shrink-0 bg-[#fbf6e8] border-t border-[#c9b884] p-3 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <button
            id="btn-voice-input"
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-full transition-all cursor-pointer ${
              isListening
                ? "bg-[#a8231a] text-white animate-bounce"
                : "bg-[#ebe2c8] hover:bg-[#d9cda7] text-[#1b1612]"
            }`}
            title={isListening ? "Listening... click to stop" : "Speak question in Hindi/English"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            id="chat-input-field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isListening
                ? "Bolna shuru karein (Listening)..."
                : `Poochiye (e.g. Purva Phalguni kya hota hai, Career...)...`
            }
            className="flex-1 rounded-full bg-[#f6efdc] border border-[#c9b884] focus:border-[#c8531c] focus:outline-none px-4 py-2.5 text-sm text-[#1b1612] placeholder-[#a89a7d]"
          />

          <button
            id="btn-send-chat"
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-full bg-[#c8531c] hover:bg-[#a53f12] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-all cursor-pointer"
            title="Send Message"
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
