import { Action, ActionResponse, StoredActionResponse } from "@/types"
import { handleClientError } from "./error"
import { WithPersistedModelData } from "@kluai/core/dist/cjs/common/models"
import { FeedbackModel } from "@kluai/core/dist/cjs/feedback/models"

export const getVariables = (prompt: string): string[] => {
  const regex = /\{\{(.+?)\}\}/g
  const unique = new Set(
    Array.from(prompt.matchAll(regex)).map((match) => match[1].trim())
  )
  return Array.from(unique)
}

/**
 * Implements ReadableStream.from(asyncIterable), which isn't documented in MDN and isn't implemented in node.
 * https://github.com/whatwg/streams/commit/8d7a0bf26eb2cc23e884ddbaac7c1da4b91cf2bc
 */
export function readableFromAsyncIterable<T>(iterable: AsyncIterable<T>) {
  let it = iterable[Symbol.asyncIterator]()
  return new ReadableStream<T>({
    async pull(controller) {
      const { done, value } = await it.next()
      if (done) controller.close()
      else controller.enqueue(value)
    },

    async cancel(reason) {
      await it.return?.(reason)
    },
  })
}

/**
 * Check if a given action response is saved in the stored action responses.
 *
 * @param {StoredActionResponse[] | undefined} storedActionResponses - The array of stored action responses.
 * @param {ActionResponse | undefined} selectedActionResponse - The selected action response to check for.
 *
 * @returns {boolean} Returns true if the action response is saved, otherwise returns false.
 */
export const checkIfActionResponseIsSaved = (
  storedActionResponses: StoredActionResponse[] | undefined,
  selectedActionResponse: ActionResponse | undefined
) => {
  /**
   * If storedActionResponses is falsy or empty, or selectedActionResponse is falsy,
   * the action response is considered not saved.
   */
  if (
    !storedActionResponses ||
    storedActionResponses.length === 0 ||
    !selectedActionResponse
  ) {
    return false
  }

  /**
   * Check if there is an existing action response in the storedActionResponses array
   * with the same data_guid and actionGuid as the selectedActionResponse.
   */
  const existingActionResponse = storedActionResponses.find(
    (r) =>
      r.data_guid === selectedActionResponse.data_guid &&
      r.actionGuid === selectedActionResponse.actionGuid
  )

  // If an existing action response is found, it is considered saved.
  if (existingActionResponse) {
    return true
  }

  // If no existing action response is found, it is considered not saved.
  return false
}

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
  onStream: (text: string) => void,
  onComplete: (text: string) => void
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

    const reader = req.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()

    let done = false

    let text = ""
    while (!done) {
      const { done: doneReading, value } = await reader.read()
      done = doneReading
      if (done) {
        onComplete(text)
        return
      }
      const chunkValue = decoder.decode(value)
      console.log(chunkValue)
      text += chunkValue
      onStream(text)
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
