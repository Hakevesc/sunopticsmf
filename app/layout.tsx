import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
