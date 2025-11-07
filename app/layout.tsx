import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beam Stress Load Calculator",
  description: "Calculate bending stress for fixed-fixed beams with point loads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}

