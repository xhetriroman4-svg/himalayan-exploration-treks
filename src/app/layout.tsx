import type { Metadata } from "next";
import { Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

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

const playfair = Playfair_Display({
  variable: "--font-cinematic",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
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
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable} antialiased`}>
        <Providers>
          {/* Simple autoplay looping muted video background. */}
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
        </Providers>
      </body>
    </html>
  );
}
