import type { Components } from "react-markdown"
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { cn } from "@/utils/cn"
import { CopyButton } from "./copy-button"

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
    <code
      className={cn(
        className,
        "whitespace-pre-wrap rounded-lg bg-zinc-100 px-1.5 py-1 text-xs text-zinc-700"
      )}
    >
      {children}
    </code>
  )
}

export { CodeBlock }
