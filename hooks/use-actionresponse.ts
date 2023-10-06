import { IKluNextContext } from "@/app/provider"
import { ActionResponse } from "@/types"
import { checkIfActionResponseIsSaved } from "@/utils/klu"
import { useEffect, useState } from "react"

/**
 * Custom React hook to check if a selected action response is saved.
 *
 * @param {IKluNextContext["response"]["storedActionResponses"]} storedActionResponses - The stored action responses.
 * @param {IKluNextContext["response"]["selectedActionResponse"]} selectedActionResponse - The selected action response.
 *
 * @returns {{ isActionResponseIsSaved: boolean }} An object containing a boolean indicating whether the action response is saved.
 */
const useCheckIfActionResponseIsSaved = (
  storedActionResponses: IKluNextContext["response"]["storedActionResponses"],
  selectedActionResponse: ActionResponse
) => {
  /**
   * State to track whether the selected action response is saved.
   * @type {[boolean, (value: boolean) => void]}
   */
  const [isSaved, setSaved] = useState(
    checkIfActionResponseIsSaved(storedActionResponses, selectedActionResponse)
  )

  /**
   * Effect to update the saved status when dependencies change.
   */
  useEffect(() => {
    setSaved(
      checkIfActionResponseIsSaved(
        storedActionResponses,
        selectedActionResponse
      )
    )
  }, [storedActionResponses, selectedActionResponse])

  return {
    isActionResponseIsSaved: isSaved,
  }
}

export default useCheckIfActionResponseIsSaved
