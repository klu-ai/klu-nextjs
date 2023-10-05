"use client"

import { IKluNextContext, useKluNext } from "@/app/provider"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import useCheckIfActionResponseIsSaved from "@/hooks/use-actionresponse"
import { ActionResponse } from "@/types"
import { Bookmark, BookmarkMinus, RotateCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const ResponseItem = ({
  actionResponse,
  storedActionResponses,
  generate,
  saveResponse,
  unsaveResponse,
}: {
  actionResponse: ActionResponse
  storedActionResponses: IKluNextContext["response"]["storedActionResponses"]
  generate: IKluNextContext["response"]["generate"]
  saveResponse: IKluNextContext["response"]["saveResponse"]
  unsaveResponse: IKluNextContext["response"]["unsaveResponse"]
}) => {
  const [state, setState] = useState<"IDLE" | "REGENERATING">("IDLE")

  const { isActionResponseIsSaved } = useCheckIfActionResponseIsSaved(
    storedActionResponses,
    actionResponse
  )

  async function regenerate(input: ActionResponse["input"]) {
    setState("REGENERATING")
    try {
      await generate(input, { regenerate: true })
      toast.success("Response is regenerated")
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setState("IDLE")
    }
  }

  return (
    <>
      <div
        key={actionResponse.actionGuid}
        className="border-black/10 border-[1px] rounded-md bg-white p-4"
      >
        <Markdown text={actionResponse.msg} />
      </div>
      <div className="flex items-center gap-[20px]">
        <Button
          variant="secondary"
          onClick={async () => await regenerate(actionResponse.input)}
          icon={{ icon: RotateCw }}
          disabled={state === "REGENERATING"}
          isLoading={state === "REGENERATING"}
        >
          {state === "REGENERATING" ? "Regenerating" : "Regenerate"}
        </Button>
        <Button
          variant="secondary"
          icon={{ icon: isActionResponseIsSaved ? BookmarkMinus : Bookmark }}
          onClick={
            isActionResponseIsSaved
              ? () => unsaveResponse(actionResponse)
              : () => saveResponse(actionResponse)
          }
        >
          {isActionResponseIsSaved ? "Unsave" : "Save"}
        </Button>
      </div>
    </>
  )
}

const Content = () => {
  const {
    response: {
      actionResponses,
      storedActionResponses,
      generate,
      saveResponse,
      unsaveResponse,
    },
  } = useKluNext()

  if (!actionResponses || actionResponses?.length === 0)
    return (
      <div className="m-auto text-center gap-[10px]">
        <p className="text-[14px] font-medium opacity-80">No Response</p>
        <p className="text-[14px] opacity-50">
          Please run your action first to be able to see the response
        </p>
      </div>
    )

  return actionResponses.map((ar) => (
    <ResponseItem
      key={ar.actionGuid}
      actionResponse={ar}
      generate={generate}
      saveResponse={saveResponse}
      unsaveResponse={unsaveResponse}
      storedActionResponses={storedActionResponses}
    />
  ))
}

export { Content }
