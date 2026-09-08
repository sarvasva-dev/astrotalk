import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = Boolean(
  clerkPubKey && clerkPubKey.trim() !== "" && !clerkPubKey.includes("MY_") && clerkPubKey.startsWith("pk_")
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isClerkConfigured ? (
      <ClerkProvider publishableKey={clerkPubKey}>
        <App isClerkConfigured={true} />
      </ClerkProvider>
    ) : (
      <App isClerkConfigured={false} />
    )}
  </StrictMode>
);
