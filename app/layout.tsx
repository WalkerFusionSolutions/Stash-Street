import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-geist",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Stash Street Apparel — We Stay On Top So You Can Be On Top",
    template: "%s | Stash Street Apparel",
  },
  description:
    "Grenada's home for authentic designer clothing and accessories. Guaranteed authenticity, affordable prices, peak quality. Custom orders welcome.",
  keywords: ["streetwear", "designer", "Grenada", "authentic", "custom orders", "luxury fashion"],
  openGraph: {
    siteName: "Stash Street Apparel",
    locale: "en_US",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
