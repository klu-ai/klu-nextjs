import klu from "@/libs/klu"
import { readableFromAsyncIterable } from "@/utils/klu"
import { StreamingTextResponse } from "@/utils/stream"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { input, id } = await req.json()

  if (!id || !input) throw new Error("Missing parameters")

  const response = await klu.actions.stream(id, input)

  const stream = readableFromAsyncIterable(response.streamingData)

  return new StreamingTextResponse(stream)
}
