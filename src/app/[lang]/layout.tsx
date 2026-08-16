import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@wrksz/themes/next";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import DictionaryProvider from "@/i18n/DictionaryProvider";

import { AdminProvider } from "@/components/AdminContext";
import { GlobalEditModal } from "@/components/GlobalEditModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ali Alzahrat - Portfolio",
  description: "Personal Portfolio and Projects Showcase",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider>
            <DictionaryProvider dictionary={dictionary} locale={lang}>
              {children}
              <GlobalEditModal />
            </DictionaryProvider>
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
