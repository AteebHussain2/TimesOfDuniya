import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next";
import AppProvider from "@/components/AppProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { shadcn } from '@clerk/themes';
import type { Metadata } from "next";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITLAA - Insights And Trends All Around",
  description:
    "Stay updated with the latest news from around the world. Breaking news, politics, technology, sports, and more.",
  keywords: ["news", "breaking news", "world news", "politics", "technology", "sports", "anime", "health", "pakistan"],
  authors: [{ name: "ITLAA" }],
  creator: "ITLAA",
  publisher: "ITLAA",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://itlaa.vercel.app",
    title: "ITLAA - Insights and Trends All Around",
    description: "Stay updated with the latest news from around the world.",
    siteName: "ITLAA",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITLAA - Insights and Trends All Around",
    description: "Stay updated with the latest news from around the world.",
    creator: "@itlaa",
  },
  verification: {
    google: '9UeBDmTgKvOttg8BMhpKt9-O3AupRMAvkEhkkXsXhn4',
  },
  other: {
    'google-site-verification': '9UeBDmTgKvOttg8BMhpKt9-O3AupRMAvkEhkkXsXhn4',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: shadcn }}>
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
