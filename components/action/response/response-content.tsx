"use client"

import { IKluNextContext, useKluNext } from "@/app/provider"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import useCheckIfActionResponseIsSaved from "@/hooks/use-actionresponse"
import { ActionResponse } from "@/types"
import {
  Bookmark,
  BookmarkMinus,
  Copy,
  RotateCw,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from "lucide-react"
import { memo, useState } from "react"
import { toast } from "sonner"
import * as Accordion from "@/components/ui/accordion"
import { copyToClipboard, isObject } from "@/utils"
import { Code } from "@/components/ui/markdown/code-block"

const ResponseItem = memo(
  ({
    actionResponse,
    appState,
  }: {
    actionResponse: ActionResponse
    appState: IKluNextContext["state"]["value"]
  }) => {
    const {
      response: {
        storedActionResponses,
        streamResponse,
        saveResponse,
        unsaveResponse,
        sendFeedback,
      },
    } = useKluNext()

    const [state, setState] = useState<"IDLE" | "REGENERATING">("IDLE")

    const { isActionResponseIsSaved } = useCheckIfActionResponseIsSaved(
      storedActionResponses,
      actionResponse
    )

    async function regenerate(response: ActionResponse) {
      setState("REGENERATING")
      try {
        await streamResponse(response.input, response.data_guid)
        toast.success("Response is regenerated")
      } catch (e) {
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
        {actionResponse.streaming ? null : (
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-[10px]">
              <Button
                variant="secondary"
                onClick={async () => await regenerate(actionResponse)}
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
                icon={{
                  icon: isActionResponseIsSaved ? BookmarkMinus : Bookmark,
                }}
                size={"sm"}
                disabled={state === "REGENERATING"}
                onClick={
                  isActionResponseIsSaved
                    ? () => unsaveResponse(actionResponse)
                    : () => saveResponse(actionResponse)
                }
              >
                {isActionResponseIsSaved ? "Unsave" : "Save"}
              </Button>
            </div>
            <div className="flex items-center gap-[10px]">
              <Button
                variant="secondary"
                onClick={async () =>
                  await sendFeedback(actionResponse.data_guid, "positive")
                }
                icon={{ icon: ThumbsUp }}
                size={"sm"}
                className={
                  actionResponse.isPositive
                    ? "text-green-500 bg-green-50 border-green-300 hover:bg-green-100"
                    : ""
                }
                disabled={state === "REGENERATING"}
              />
              <Button
                variant="secondary"
                onClick={async () =>
                  await sendFeedback(actionResponse.data_guid, "negative")
                }
                icon={{ icon: ThumbsDown }}
                className={
                  actionResponse.isNegative
                    ? "text-red-500 bg-red-50 border-red-300 hover:bg-red-100"
                    : ""
                }
                size={"sm"}
                disabled={state === "REGENERATING"}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
)

ResponseItem.displayName = "ResponseItem"

const Content = () => {
  const {
    response: { actionResponses },
    state: { value: stateValue },
  } = useKluNext()

  if (!actionResponses || actionResponses?.length === 0)
    return (
      <div className="m-auto text-center gap-[10px] xl:py-0 py-[40px]">
        <div className="flex justify-center mb-4">
          <Zap className="inline-grid opacity-50" />
        </div>
        <p className="text-[14px] font-medium opacity-80">Generate with Klu</p>
        <p className="text-[14px] opacity-50">
          Action generations will appear here
        </p>
      </div>
    )

  return actionResponses.map((ar) => (
    <ResponseItem
      key={ar.actionGuid}
      actionResponse={ar}
      appState={stateValue}
    />
  ))
}

export { Content }
