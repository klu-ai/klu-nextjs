"use client"

import { createContext } from "react"
import { Toaster } from "sonner"

const KluContext = createContext({})

export default function KluProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <KluContext.Provider value="">
      <>
        <Toaster richColors closeButton position="bottom-right" />
        {children}
      </>
    </KluContext.Provider>
  )
}
