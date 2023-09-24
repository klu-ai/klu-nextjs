"use client"

import { IKluNextContext } from "@/app/provider"
import * as Accordion from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import { Code } from "@/components/ui/markdown/code-block"
import { ActionResponse, StoredActionResponse } from "@/types"
import { copyToClipboard, isObject } from "@/utils"
import { BookmarkMinus, Copy, Expand, Minimize } from "lucide-react"
import { toast } from "sonner"

function Saved({
  response,
  selectedActionGuid,
}: {
  response: IKluNextContext["response"]
  selectedActionGuid: IKluNextContext["action"]["selectedActionGuid"]
}) {
  const {
    storedActionResponses,
    setSelectedActionResponse,
    selectedActionResponse,
    setStoredActionResponses,
  } = response

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

  if (!storedActionResponses || storedActionResponses.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <div className="flex flex-col gap-[10px] m-auto text-center w-2/3">
          <p className="text-[14px] font-medium opacity-80">
            No Saved Action Response
          </p>
          <p className="text-[14px] opacity-50">
            Please run your action first to be able to see and save the response
          </p>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col gap-[10px] my-[20px]">
      {storedActionResponses
        .filter((r) => r.actionGuid === selectedActionGuid)
        .map((r) => (
          <div
            key={r.actionGuid}
            className="flex flex-col gap-[5px] bg-off-white p-4 rounded-md border-black/10 border-[1px]"
          >
            <Accordion.Root type="single" collapsible>
              <Accordion.Item value="item-1">
                <Accordion.Trigger>Input</Accordion.Trigger>
                <Accordion.Content>
                  <div className="flex flex-row gap-[5px] border-black/10 border-[1px] rounded-md bg-white p-[5px]">
                    {isObject(r.input)
                      ? Object.entries(r.input).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex w-full items-center gap-[3px]"
                          >
                            <div className="w-1/3">
                              <Code className="text-[10px] w-fit lowercase">
                                {key}
                              </Code>
                            </div>
                            <p className="text-[12px] w-2/3 h-fit">{value}</p>
                          </div>
                        ))
                      : r.input}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
            <Accordion.Root type="single" collapsible>
              <Accordion.Item value="item-1">
                <Accordion.Trigger>Response</Accordion.Trigger>
                <Accordion.Content>
                  <div className="border-black/10 border-[1px] rounded-md bg-white p-4 h-[300px] overflow-y-auto scroll-stable scroll-smooth">
                    <Markdown text={r.msg} />
                  </div>
                  <div className="flex items-center w-full mt-[10px] gap-[10px]">
                    <Button
                      variant="secondary"
                      size={"sm"}
                      onClick={() => copyToClipboard(r.msg)}
                      icon={{ icon: Copy }}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="secondary"
                      size={"sm"}
                      onClick={() =>
                        setSelectedActionResponse(
                          selectedActionResponse?.data_guid === r.data_guid
                            ? undefined
                            : r
                        )
                      }
                      icon={{
                        icon:
                          selectedActionResponse?.data_guid === r.data_guid
                            ? Minimize
                            : Expand,
                      }}
                    >
                      {selectedActionResponse?.data_guid === r.data_guid
                        ? "Minimize"
                        : "Maximize"}
                    </Button>
                    <Button
                      variant="secondary"
                      size={"sm"}
                      icon={{ icon: BookmarkMinus }}
                      onClick={() => unsave(r, storedActionResponses)}
                    >
                      Unsave
                    </Button>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        ))}
    </div>
  )
}

export { Saved }
