import { IKluNextContext } from "@/app/provider"
import { checkIfActionResponseIsSaved } from "@/utils/klu"
import { useEffect, useState } from "react"

const useCheckIfActionResponseIsSaved = (
  storedActionResponses: IKluNextContext["response"]["storedActionResponses"],
  selectedActionResponse: IKluNextContext["response"]["selectedActionResponse"]
) => {
  const [isSaved, setSaved] = useState(
    checkIfActionResponseIsSaved(storedActionResponses, selectedActionResponse)
  )

  useEffect(
    () =>
      setSaved(
        checkIfActionResponseIsSaved(
          storedActionResponses,
          selectedActionResponse
        )
      ),
    [storedActionResponses, selectedActionResponse]
  )

  return {
    isActionResponseIsSaved: isSaved,
  }
}

export { useCheckIfActionResponseIsSaved }
