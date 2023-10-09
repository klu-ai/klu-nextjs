import { toast } from "sonner"

export const handleClientError = (err: unknown) => {
  const { message } = err as Error
  toast.error(message)
  console.error(message)
  throw new Error(message)
}
