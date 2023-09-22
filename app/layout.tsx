import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import KluProvider from "./provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Klu SDK Next.js Example App",
  description: "Klu (https://klu.ai) SDK Example App with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KluProvider>{children}</KluProvider>
      </body>
    </html>
  )
}
