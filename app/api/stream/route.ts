import klu from "@/libs/klu"
import { readableFromAsyncIterable } from "@/utils/klu"

export class StreamingTextResponse extends Response {
  constructor(res: ReadableStream, init?: ResponseInit, data?: any) {
    let processedStream = res

    if (data) {
      processedStream = res.pipeThrough(data.stream)
    }

    super(processedStream as any, {
      ...init,
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Experimental-Stream-Data": data ? "true" : "false",
        ...init?.headers,
      },
    })
  }
}

export async function POST(req: Request) {
  const { input, id } = await req.json()

  if (!id || !input) throw new Error("Missing parameters")

  const response = await klu.actions.stream(id, input)

  const stream = readableFromAsyncIterable(response.streamingData)

  return new StreamingTextResponse(stream)
}
