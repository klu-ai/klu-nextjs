"use client"

import { useKluNext } from "@/app/provider"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import { useCheckIfActionResponseIsSaved } from "@/hooks/use-actionresponse"
import { ActionResponse, StoredActionResponse } from "@/type"
import { copyToClipboard, now } from "@/utils"
import { Bookmark, BookmarkMinus, Copy, RotateCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const Content = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const [state, setState] = useState<"IDLE" | "REGENERATING">("IDLE")

  const {
    response: {
      selectedActionResponse,
      generate,
      storedActionResponses,
      setStoredActionResponses,
    },
  } = useKluNext()

  const { isActionResponseIsSaved } = useCheckIfActionResponseIsSaved(
    storedActionResponses,
    selectedActionResponse
  )

  if (!selectedActionResponse || !storedActionResponses)
    return (
      <div className="m-auto text-center">
        <p className="text-[14px] font-medium opacity-80">No Response</p>
        <p className="text-[14px] opacity-50">
          Please run your action first to be able to see the response
        </p>
      </div>
    )

  async function regenerate(input: ActionResponse["input"]) {
    setState("REGENERATING")
    try {
      await generate(input)
      toast.success("Response is regenerated")
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setState("IDLE")
    }
  }

  function save(response: ActionResponse) {
    const storedActionResponse: StoredActionResponse = {
      ...response,
      storedAt: now(),
    }

    setStoredActionResponses((prev) => [storedActionResponse, ...prev])
    toast.success("Response is saved")
  }

  function unsave(
    response: ActionResponse,
    storedResponses: StoredActionResponse[]
  ) {
    const newStoredActionResponse = storedResponses.filter(
      (r) => r.data_guid !== response.data_guid
    )
    setStoredActionResponses(newStoredActionResponse)
    toast.success("Response is removed from your saved")
  }

  return (
    <>
      <div className="border-black/10 border-[1px] rounded-md bg-white p-4">
        <Markdown text={selectedActionResponse.msg} />
      </div>
      <div className="flex items-center gap-[20px]">
        <Button
          variant="secondary"
          onClick={async () => await regenerate(selectedActionResponse.input)}
          icon={{ icon: RotateCw }}
          disabled={state === "REGENERATING"}
          isLoading={state === "REGENERATING"}
        >
          {state === "REGENERATING" ? "Regenerating" : "Regenerate"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => copyToClipboard(selectedActionResponse.msg)}
          icon={{ icon: Copy }}
        >
          Copy
        </Button>
        <Button
          variant="secondary"
          icon={{ icon: isActionResponseIsSaved ? BookmarkMinus : Bookmark }}
          onClick={
            isActionResponseIsSaved
              ? () => unsave(selectedActionResponse, storedActionResponses)
              : () => save(selectedActionResponse)
          }
        >
          {isActionResponseIsSaved ? "Unsave" : "Save"}
        </Button>
      </div>
    </>
  )
}

export { Content }
