import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import BackgroundGrid from "@/components/parallax/BackgroundGrid";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
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
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip">
        <BackgroundGrid />
        <Nav />
        {children}
      </body>
    </html>
  );
}
