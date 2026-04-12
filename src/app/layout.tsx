import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/Provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthInitializer from "@/components/auth/AuthInitializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LuxeLiving — Premium Real Estate",
    template: "%s | LuxeLiving",
  },
  description:
    "Discover luxury properties and premium real estate with LuxeLiving. Find your dream home with expert agents, virtual tours, and exclusive listings.",
  keywords: [
    "real estate",
    "luxury homes",
    "property",
    "premium real estate",
    "dream home",
    "luxury living",
    "real estate agents",
    "property listings",
  ],
  authors: [{ name: "LuxeLiving Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luxeliving.com",
    siteName: "LuxeLiving",
    title: "LuxeLiving — Premium Real Estate",
    description: "Discover luxury properties and premium real estate with LuxeLiving.",
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
      className={`${inter.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <ReduxProvider>
            <AuthInitializer>
              {children}
              <script dangerouslySetInnerHTML={{ __html: `window.chtlConfig = { chatbotId: "8329543734" }` }} />
              <script async data-id="8329543734" id="chtl-script" type="text/javascript" src="https://chatling.ai/js/embed.js"></script>
              <Toaster richColors position="top-right" />
            </AuthInitializer>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
