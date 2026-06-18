import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const description =
  "Software engineer and designer at Carnegie Mellon. I build careful software — the kind where the details are the point.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s — Jonathan Gong",
    default: "Jonathan Gong — Software Engineer & Designer",
  },
  description,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Jonathan Gong",
    title: "Jonathan Gong — Software Engineer & Designer",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Gong — Software Engineer & Designer",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
      </body>
    </html>
  );
}
