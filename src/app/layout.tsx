import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next";
import AppProvider from "@/components/AppProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Times Of Duniya - Latest News & Updates",
  description:
    "Stay updated with the latest news from around the world. Breaking news, politics, technology, sports, and more.",
  keywords: ["news", "breaking news", "world news", "politics", "technology", "sports"],
  authors: [{ name: "Times Of Duniya" }],
  creator: "Times Of Duniya",
  publisher: "Times Of Duniya",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://timesofduniya.com",
    title: "Times Of Duniya - Latest News & Updates",
    description: "Stay updated with the latest news from around the world.",
    siteName: "Times Of Duniya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Times Of Duniya - Latest News & Updates",
    description: "Stay updated with the latest news from around the world.",
    creator: "@timesofduniya",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={'/'}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} antialiased`}>
          <AppProvider>
            {children}
          </AppProvider>
          <Toaster richColors position="bottom-right" theme="system" />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
};
