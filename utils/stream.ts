import { NextResponse } from "next/server"

export class StreamingTextResponse extends NextResponse {
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
