import type { Metadata } from "next";
import "@/src/index.css";

export const metadata: Metadata = {
  title: "Astroguru - AI Vedic Astrologer & Kundli Consultation",
  description: "Personalized AI Vedic Astrology & Live Kundli Consultation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#070d1a" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
