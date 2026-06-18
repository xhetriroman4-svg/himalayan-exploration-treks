import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import VideoBackground from "@/components/VideoBackground";

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
        {/* Full-site looping muted video background — mounted once, persists across all routes */}
        <VideoBackground />
        {children}
      </body>
    </html>
  );
}
