import { Action } from "@/types"
import { handleClientError } from "./error"
import { FeedbackModel, WithPersistedModelData } from "@kluai/core"

export const fetchAction = async (actionGuid: string) => {
  try {
    const req = await fetch(`/api/action?id=${actionGuid}`)
    if (req.status === 500) {
      throw new Error(req.statusText)
    }
    const res = (await req.json()) as unknown as Action
    return res
  } catch (err) {
    return handleClientError(err)
  }
}

export const postActionResponse = async <T>(
  actionGuid: string,
  values: any
) => {
  try {
    const req = await fetch(`/api/action`, {
      method: "POST",
      body: JSON.stringify({
        id: actionGuid,
        input: values,
      }),
    })

    if (req.status === 500) {
      throw new Error(req.statusText)
    }

    const res = (await req.json()) as unknown as T

    return res
  } catch (err) {
    return handleClientError(err)
  }
}

export const streamActionResponse = async (
  actionGuid: string,
  values: any,
  controller: AbortController,
  cb: {
    onStart?: () => void
    onStreaming: (text: string) => void
    onComplete: (text: string, data_guid: string) => void
  }
) => {
  try {
    const req = await fetch(`/api/stream`, {
      method: "POST",
      body: JSON.stringify({
        id: actionGuid,
        input: values,
      }),
      signal: controller.signal,
    })

    const dataGuid = req.headers.get("X-Action-Response-Data-Id")

    const reader = req.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()

    let done = false

    let text = ""

    cb.onStart?.()

    while (!done) {
      const { done: doneReading, value } = await reader.read()
      done = doneReading
      if (done) {
        cb.onComplete(text, dataGuid!)
        return
      }
      const chunkValue = decoder.decode(value)
      text += chunkValue
      cb.onStreaming(text)
    }
  } catch (err) {
    return handleClientError(err)
  }
}

export const postActionResponseFeedback = async (
  type: "positive" | "negative",
  dataGuid: string
) => {
  try {
    const req = await fetch(`/api/feedback`, {
      method: "POST",
      body: JSON.stringify({
        id: dataGuid,
        type,
      }),
    })

    if (req.status === 500) {
      throw new Error(req.statusText)
    }

    const res = (await req.json()) as WithPersistedModelData<FeedbackModel>

    return res
  } catch (err) {
    return handleClientError(err)
  }
}
