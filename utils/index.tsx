import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ActionResponse } from "@/components/action"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copyToClipboard = (message: ActionResponse["msg"]) => {
  navigator.clipboard.writeText(message.trim())
  toast.success("Response is copied")
}

export const isObject = (a: string) => {
  const obj = JSON.parse(JSON.stringify(a))
  return !!obj && !Array.isArray(obj) && obj.constructor === Object
}

export const now = (): string => new Date().toISOString()
