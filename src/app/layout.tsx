import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Himalayan Exploration Treks | Adventure Travel Packages Nepal",
  description:
    "Himalayan Exploration Treks — A small company based in Kathmandu providing adventure travel packages that deliver amazing adventures. Trekking Everest Base Camp, Annapurna Circuit, Upper Mustang, Langtang, Manaslu & Dolpo regions since 2013.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        {/* Simple autoplay looping muted video background.
            Plain HTML5 <video> — no JS, no React state, no iframes, no fallbacks.
            Just the video element with the standard 4 attributes that every browser supports:
              autoPlay  → starts playing immediately
              loop      → plays forever
              muted     → required for autoplay to work in Chrome/Safari
              playsInline → required for iOS Safari (don't force fullscreen)
        */}
        <video
          className="video-bg"
          autoPlay
          loop
          muted
          playsInline
          src="https://res.cloudinary.com/dc4qh1wrh/video/upload/v1/1_n3fzeu.mp4"
        />
        {/* Subtle dark overlay so text stays readable over the video */}
        <div className="video-bg-overlay" />
        {children}
      </body>
    </html>
  );
}
