import type { Components } from "react-markdown"
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { cn } from "@/utils"
import { CopyButton } from "./copy-button"
import React from "react"

const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <code
        className={cn(
          className,
          "whitespace-pre-wrap rounded-md bg-zinc-100 px-1.5 py-[3px] pb text-zinc-700 border-black/10 border-[1px]"
        )}
        ref={ref}
        {...props}
      >
        {children}
      </code>
    )
  }
)

Code.displayName = "Code"

const CodeBlock: Components["code"] = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || "")

  return !inline && match && match.length > 1 ? (
    <div className="group relative whitespace-pre-wrap text-xs border-black/10 border-[1px] rounded-md p-1">
      <div className="absolute right-0 top-0 rounded-lg p-3">
        <CopyButton text={String(children).replace(/\n$/, "")} />
      </div>
      {/* TODO: Fix syntax color doesn't show up */}
      <SyntaxHighlighter
        style={a11yLight}
        language={match[1]}
        PreTag="div"
        className="rounded-lg"
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <Code className={cn("text-[12px]", className)}>{children}</Code>
  )
}

export { CodeBlock, Code }
