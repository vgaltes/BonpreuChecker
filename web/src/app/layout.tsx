import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ReactNode } from "react";

import { DM_Sans } from "next/font/google";
import { Space_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const fontHeading = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "700"],
});

type Props = {
  children: ReactNode;
};

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <title>Observatori Bonpreu</title>
      </head>
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
