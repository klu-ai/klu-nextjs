"use client"

import React from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import { Clipboard, ClipboardCheck } from "lucide-react"
import { cn } from "@/utils/cn"
import { Button } from "../button"

const CopyButton = ({ text }: { text: string }) => {
  const [effect, setEffect] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (effect) {
      setTimeout(() => {
        setEffect(false)
      }, 1500)
    }
  }, [effect])

  const handleCopy = () => {
    setEffect(true)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <div className="flex items-center">
      <CopyToClipboard text={text} onCopy={handleCopy}>
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
          tooltip="Copy"
          icon={{
            icon: copied ? ClipboardCheck : Clipboard,
            size: 14,
          }}
        >
          {copied && "Copied!"}
        </Button>
      </CopyToClipboard>
    </div>
  )
}

export { CopyButton }
