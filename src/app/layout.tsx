import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/AppProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Times Of Duniya - Home",
  description: "A place to find the latest news and updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={'/'}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} font-sans antialiased`}>
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
