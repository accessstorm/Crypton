import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ChatbotProvider } from "@/components/chatbot/chatbot-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Crypton',
    default: 'Crypton - AI-Powered Crypto & Stock Dashboard',
  },
  description: "Track cryptocurrencies and stocks with real-time data, AI predictions, and market sentiment analysis.",
  keywords: ["cryptocurrency", "stocks", "AI predictions", "financial dashboard", "market sentiment", "trading"],
  authors: [{ name: "Crypton Team" }],
  creator: "Crypton",
  publisher: "Crypton",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourdomain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Crypton - AI-Powered Crypto & Stock Dashboard',
    description: 'Track cryptocurrencies and stocks with real-time data, AI predictions, and market sentiment analysis.',
    url: 'https://yourdomain.com',
    siteName: 'Crypton',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Crypton Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypton - AI-Powered Crypto & Stock Dashboard',
    description: 'Track cryptocurrencies and stocks with real-time data, AI predictions, and market sentiment analysis.',
    images: ['https://yourdomain.com/twitter-image.jpg'],
    creator: '@crypton',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen dark:bg-slate-950`}
      >
        <Toaster richColors position="top-right" />
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
        <ChatbotProvider />
      </body>
    </html>
  );
}
