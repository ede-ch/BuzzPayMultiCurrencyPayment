import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuzzPay",
  description:
    "Manage global team expenses and payouts in real time. Convert currencies instantly and unify your business finances in a single platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${manrope.variable} scroll-smooth`}
    >
      <body className="bg-ink font-sans text-white antialiased min-h-screen relative overflow-x-hidden">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}