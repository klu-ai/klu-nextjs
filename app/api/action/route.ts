import klu from "@/libs/klu"
import { getVariables } from "@/utils/klu"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) throw new Error("Missing `id` parameters")
    const action = await klu.actions.get(id)
    return NextResponse.json(
      { ...action, variables: getVariables(action.prompt) },
      {
        status: 200,
      }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      {},
      { status: 500, statusText: (err as Error).message }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { input, id } = await req.json()

    if (!id || !input) throw new Error("Missing parameters")

    const response = await klu.actions.prompt(id, input as Object)

    return NextResponse.json(response, {
      status: 200,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      {},
      { status: 500, statusText: (err as Error).message }
    )
  }
}
