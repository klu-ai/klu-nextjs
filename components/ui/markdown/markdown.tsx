"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "./code-block"

const Markdown: React.FC<{ text: string }> = ({ text }): React.ReactElement => (
  <div className="flex flex-col gap-[10px]">
    {/* TODO: Support diagram */}
    {/* https://www.skovy.dev/blog/vercel-ai-rendering-markdown?seed=hk1bvs */}
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeBlock,
        p: ({ node, ...props }) => <p {...props} className="m-0 p-0" />,
        ul: ({ node, ...props }) => (
          <ul {...props} className="m-0 list-inside list-disc p-0" />
        ),
        ol: ({ node, ...props }) => (
          <ol {...props} className="m-0 list-inside list-decimal p-0" />
        ),
        li: ({ node, ...props }) => (
          <li {...props} className="leading-1 px-2" />
        ),
        a: ({ node, ...props }) => (
          <a {...props} className="text-primary hover:underline" />
        ),
        strong: ({ node, ...props }) => (
          <strong {...props} className="font-bold" />
        ),
        em: ({ node, ...props }) => <em {...props} className="italic" />,
        del: ({ node, ...props }) => (
          <del {...props} className="line-through" />
        ),
        h1: ({ node, ...props }) => <h1 {...props} className="my-1 text-2xl" />,
        h2: ({ node, ...props }) => <h2 {...props} className="my-1 text-xl" />,
        h3: ({ node, ...props }) => <h3 {...props} className="my-1 text-lg" />,
        h4: ({ node, ...props }) => <h4 {...props} className="text-md my-1" />,
        h5: ({ node, ...props }) => (
          <h5 {...props} className="my-1 text-base" />
        ),
        h6: ({ node, ...props }) => <h6 {...props} className="my-1 text-sm" />,
      }}
    >
      {text.trim()}
    </ReactMarkdown>
  </div>
)

export { Markdown }
