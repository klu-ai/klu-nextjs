import { cn } from "@/utils/cn"
import { createTsForm } from "@ts-react/form"
import { z } from "zod"
import { Button } from "../button"
import * as Field from "./field"
import { LongStringSchema, OptionalLongStringSchema } from "./schema"

function FormComponent({
  onSubmit,
  children,
  loading,
  button,
  className,
}: {
  onSubmit: () => void
  children: React.ReactNode
  loading: boolean
  button: Parameters<typeof Button>[0]
  className?: string
}) {
  const {
    disabled: buttonDisabled,
    children: buttonChildren,
    ...buttonRest
  } = button
  return (
    <form
      className={cn("flex flex-col space-y-3", className)}
      onSubmit={onSubmit}
    >
      {children}
      <Button
        className="mt-4 w-full"
        type="submit"
        disabled={buttonDisabled ?? loading}
        isLoading={loading}
        {...buttonRest}
      >
        {buttonChildren}
      </Button>
    </form>
  )
}

const mapping = [
  [z.string(), Field.Text],
  [OptionalLongStringSchema(), Field.TextArea],
  [LongStringSchema(), Field.TextArea],
] as const // 👈 `as const` is necessary

// A typesafe React component
export const Form = createTsForm(mapping, { FormComponent })
