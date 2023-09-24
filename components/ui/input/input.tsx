import { cn } from "@/utils"
import * as React from "react"

/* export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {} */

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "focus-visible:ring-none flex h-9 w-full rounded-md border border-black/10 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black/30 focus-visible:bg-black/[0.025] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
