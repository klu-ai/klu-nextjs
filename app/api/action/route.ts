import klu from "@/libs/klu"
import { getVariables, iteratorToStream } from "@/utils/klu"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ message: "Missing parameters" })
  const action = await klu.actions.get(id)
  return NextResponse.json({
    data: { ...action, variables: getVariables(action.prompt) },
  })
}

export async function POST(req: NextRequest) {
  const { messages, id } = await req.json()

  if (!id || !messages)
    return NextResponse.json({ message: "Missing parameters" })

  const response = await klu.actions.stream(id, messages)

  const stream = iteratorToStream(response.streamingData)

  return new Response(stream)
}
