import React from "react";
import { Sparkles, Phone, ScrollText, User } from "lucide-react";
import type { PageRoute } from "../types";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

interface BottomNavProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  isClerkConfigured?: boolean;
}

export default function BottomNav({ currentRoute, onNavigate, isClerkConfigured = false }: BottomNavProps) {
  const isRouteActive = (page: string) => currentRoute.page === page;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#fbf6e8] border-t border-[#c9b884] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-between px-2 py-2">
        <button
          onClick={() => onNavigate({ page: "landing" })}
          className={`flex flex-col items-center justify-center w-full py-1 ${
            isRouteActive("landing") ? "text-[#c8531c]" : "text-[#786a55]"
          }`}
        >
          <Sparkles size={20} className={isRouteActive("landing") ? "animate-pulse" : ""} />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </button>

        <button
          onClick={() => onNavigate({ page: "kundli" })}
          className={`flex flex-col items-center justify-center w-full py-1 ${
            isRouteActive("kundli") ? "text-[#c8531c]" : "text-[#786a55]"
          }`}
        >
          <ScrollText size={20} />
          <span className="text-[10px] font-semibold mt-1">Kundli</span>
        </button>

        <button
          onClick={() => onNavigate({ page: "consult" })}
          className={`flex flex-col items-center justify-center w-full py-1 ${
            isRouteActive("consult") ? "text-[#c8531c]" : "text-[#786a55]"
          }`}
        >
          <Phone size={20} />
          <span className="text-[10px] font-semibold mt-1">Consult</span>
        </button>

        {isClerkConfigured ? (
          <div className="flex flex-col items-center justify-center w-full py-1">
            <SignedIn>
              <div onClick={() => onNavigate({ page: "profile" })} className="flex flex-col items-center cursor-pointer">
                 <UserButton afterSignOutUrl="/" />
                 <span className="text-[10px] font-semibold mt-1 text-[#786a55]">Profile</span>
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex flex-col items-center justify-center text-[#786a55]">
                  <User size={20} />
                  <span className="text-[10px] font-semibold mt-1">Login</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        ) : (
          <button
            onClick={() => onNavigate({ page: "profile" })}
            className={`flex flex-col items-center justify-center w-full py-1 ${
              isRouteActive("profile") ? "text-[#c8531c]" : "text-[#786a55]"
            }`}
          >
            <User size={20} />
            <span className="text-[10px] font-semibold mt-1">Profile</span>
          </button>
        )}
      </div>
    </nav>
  );
}
