import { cn } from "@/utils/cn"
import * as React from "react"

/* export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
} */

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[140px] w-full rounded-md border border-black/10 bg-transparent  px-3 py-2 text-sm shadow-sm placeholder:text-black/30 focus-visible:bg-black/[0.025] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-1 focus-visible:ring-black/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
