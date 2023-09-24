"use client"

import React from "react"
import { Clipboard, ClipboardCheck } from "lucide-react"
import { cn } from "@/utils"
import { Button } from "../button"
import { toast } from "sonner"

const CopyButton = ({ text }: { text: string }) => {
  const [effect, setEffect] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (effect) {
      setTimeout(() => {
        setEffect(false)
      }, 4000)
    }
  }, [effect])

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!")
    setEffect(true)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 4000)
  }

  return (
    <div className="flex items-center">
      <Button
        className={cn(
          effect
            ? "text-green-500 border-green-400"
            : "text-black/50 hover:text-black/100",
          "inline-flex items-center focus:outline-none w-fit h-fit p-1 text-[10px] font-sans"
        )}
        variant="secondary"
        onClick={handleCopy}
        onAnimationEnd={() => {
          setEffect(false)
        }}
        tooltip={effect ? "Copied" : "Copy"}
        icon={{
          icon: copied ? ClipboardCheck : Clipboard,
          size: 14,
        }}
      >
        {copied && "Copied!"}
      </Button>
    </div>
  )
}

export { CopyButton }
