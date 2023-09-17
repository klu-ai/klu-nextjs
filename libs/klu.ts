import Klu from "@kluai/core"
import { env } from "@/env.mjs"

const klu = new Klu(env.KLU_API_KEY)

export default klu
