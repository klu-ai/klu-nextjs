"use client"

import { IKluNextContext, useKluNext } from "@/app/provider"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import useCheckIfActionResponseIsSaved from "@/hooks/use-actionresponse"
import { ActionResponse } from "@/types"
import { Bookmark, BookmarkMinus, Copy, RotateCw } from "lucide-react"
import { memo, useState } from "react"
import { toast } from "sonner"
import * as Accordion from "@/components/ui/accordion"
import { copyToClipboard, isObject } from "@/utils"
import { Code } from "@/components/ui/markdown/code-block"

const ResponseItem = memo(
  ({
    actionResponse,
    appState,
    storedActionResponses,
    generate,
    saveResponse,
    unsaveResponse,
  }: {
    actionResponse: ActionResponse
    appState: IKluNextContext["state"]["value"]
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
      <div className="border-black/10 border-[1px] rounded-md bg-white p-4">
        <Accordion.Root
          type="single"
          collapsible
          defaultValue={appState === "run-batch" ? "input" : undefined}
        >
          <Accordion.Item value="input">
            <Accordion.Trigger>Input</Accordion.Trigger>
            <Accordion.Content>
              <div className="flex flex-col gap-[5px] border-black/10 border-[1px] rounded-md bg-off-white p-[12px]">
                {isObject(actionResponse.input)
                  ? Object.entries(actionResponse.input).map(([key, value]) => (
                      <div key={key} className="flex w-full flex-col gap-[5px]">
                        <Code className="text-[10px] w-fit lowercase">
                          {key}
                        </Code>
                        <p className="text-[12px] h-fit">{value}</p>
                      </div>
                    ))
                  : actionResponse.input}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <Accordion.Root type="single" defaultValue="response" collapsible>
          <Accordion.Item value="response">
            <Accordion.Trigger>Response</Accordion.Trigger>
            <Accordion.Content>
              <div className="border-black/10 border-[1px] rounded-md bg-off-white p-4 h-fit">
                <Markdown text={actionResponse.msg} />
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <div className="flex items-center gap-[10px]">
          <Button
            variant="secondary"
            onClick={async () => await regenerate(actionResponse.input)}
            icon={{ icon: RotateCw }}
            size={"sm"}
            disabled={state === "REGENERATING"}
            isLoading={state === "REGENERATING"}
          >
            {state === "REGENERATING" ? "Regenerating" : "Regenerate"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => copyToClipboard(actionResponse.msg)}
            icon={{ icon: Copy }}
            size={"sm"}
          >
            Copy
          </Button>
          <Button
            variant="secondary"
            icon={{ icon: isActionResponseIsSaved ? BookmarkMinus : Bookmark }}
            size={"sm"}
            onClick={
              isActionResponseIsSaved
                ? () => unsaveResponse(actionResponse)
                : () => saveResponse(actionResponse)
            }
          >
            {isActionResponseIsSaved ? "Unsave" : "Save"}
          </Button>
        </div>
      </div>
    )
  }
)

ResponseItem.displayName = "ResponseItem"

const Content = () => {
  const {
    response: {
      actionResponses,
      storedActionResponses,
      generate,
      saveResponse,
      unsaveResponse,
    },
    state: { value: stateValue },
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
      appState={stateValue}
      actionResponse={ar}
      generate={generate}
      saveResponse={saveResponse}
      unsaveResponse={unsaveResponse}
      storedActionResponses={storedActionResponses}
    />
  ))
}

export { Content }
