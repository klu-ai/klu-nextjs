import klu from "@/libs/klu"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

export async function POST(req: NextRequest) {
  try {
    const { id, type } = await req.json()

    if (!id || !type) throw new Error("Missing parameters")

    const response = await klu.feedback.create({
      type: "rating",
      value: type === "positive" ? "2" : "1",
      source: "Published Action",
      createdById: "",
      dataGuid: id,
    })

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
