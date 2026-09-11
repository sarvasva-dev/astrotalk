"use client";

import React, { useEffect, useState } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "@/src/App";

export default function ClientWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((error) => {
          console.log("SW registration failed: ", error);
        });
      });
    }
  }, []);

  if (!mounted) return null;

  const clerkPubKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.VITE_CLERK_PUBLISHABLE_KEY ||
    "";
  const isClerkConfigured = Boolean(
    clerkPubKey && clerkPubKey.trim() !== "" && !clerkPubKey.includes("MY_") && clerkPubKey.startsWith("pk_")
  );

  return (
    <>
      {isClerkConfigured ? (
        <ClerkProvider publishableKey={clerkPubKey}>
          <App isClerkConfigured={true} />
        </ClerkProvider>
      ) : (
        <App isClerkConfigured={false} />
      )}
    </>
  );
}
