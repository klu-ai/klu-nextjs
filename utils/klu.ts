import { Action, ActionResponse, StoredActionResponse } from "@/types"
import { handleClientError } from "./error"

export const getVariables = (prompt: string): string[] => {
  const regex = /\{\{(.+?)\}\}/g
  const unique = new Set(
    Array.from(prompt.matchAll(regex)).map((match) => match[1].trim())
  )
  return Array.from(unique)
}

/** // https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream */
export const iteratorToStream = (iterator: any) => {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
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
    const res = (await req.json()) as unknown as Action
    return res
  } catch (err) {
    return handleClientError(err)
  }
}

export const fetchActionResponse = async (actionGuid: string, values: any) => {
  try {
    const req = await fetch(`/api/action`, {
      method: "POST",
      body: JSON.stringify({
        id: actionGuid,
        input: values,
      }),
    })

    const res = (await req.json()) as unknown as Omit<
      ActionResponse,
      "actionGuid" | "input"
    >

    return res
  } catch (err) {
    return handleClientError(err)
  }
}
