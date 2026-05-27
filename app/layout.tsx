import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: 'SunOptics Eye Clinic | Premium Eye Care in Addis Ababa',
  description: 'Expert eye care and premium eyewear at Meskel Flower, Addis Ababa.',
  icons: {
    icon: '/Logo/SunOptics_Logo_Icon.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
