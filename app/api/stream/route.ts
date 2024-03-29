import klu from "@/libs/klu"
import { readableFromAsyncIterable } from "@/utils/klu"
import { StreamingTextResponse } from "@/utils/stream"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

export async function POST(req: NextRequest) {
  try {
    const { input, id } = await req.json()

    if (!id || !input) throw new Error("Missing parameters")

    const response = await klu.actions.stream(id, input)

    const stream = readableFromAsyncIterable(response.streamingData)

    return new StreamingTextResponse(stream, {
      headers: {
        "X-Action-Response-Data-Id": response.data_guid!,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      {},
      { status: 500, statusText: (err as Error).message }
    )
  }
}
