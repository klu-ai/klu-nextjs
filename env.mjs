import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    KLU_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_KLU_ACTION_GUID: z.string().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    KLU_API_KEY: process.env.KLU_API_KEY,
    NEXT_PUBLIC_KLU_ACTION_GUID: process.env.NEXT_PUBLIC_KLU_ACTION_GUID,
  },
})
