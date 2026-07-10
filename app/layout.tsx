import type { Metadata } from "next";
import { Fira_Code, IBM_Plex_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import NavBar from "@/components/NavBar";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Snippet Vault",
  description: "Write, store, and run your JS/TS code snippets.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} ${plexSans.variable} font-sans antialiased max-w-7xl mx-auto`}>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
