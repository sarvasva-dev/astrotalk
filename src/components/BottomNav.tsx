import { Phone, ScrollText, Sun, Compass } from "lucide-react";

interface BottomNavProps {
  activeTab: "consult" | "kundli" | "horoscope" | "tarot";
  setActiveTab: (tab: "consult" | "kundli" | "horoscope" | "tarot") => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: "consult", label: "Consult", icon: Phone },
    { id: "kundli", label: "Kundli", icon: ScrollText },
    { id: "horoscope", label: "Rashifal", icon: Sun },
    { id: "tarot", label: "Tarot", icon: Compass },
  ] as const;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fbf6e8]/95 backdrop-blur-md border-t border-[#c9b884] px-2 py-1.5 shadow-lg flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isActive ? "text-[#c8531c]" : "text-[#786a55] hover:text-[#1b1612]"
            }`}
          >
            <Icon size={18} className={isActive ? "scale-110" : ""} />
            <span className="text-[10px] font-semibold mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
