"use client"

import { IKluNextContext } from "@/app/provider"
import * as Accordion from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import { Code } from "@/components/ui/markdown/code-block"
import useInitialChange from "@/hooks/use-initialchange"
import { copyToClipboard, isObject } from "@/utils"
import { Bookmark, BookmarkMinus, Copy, ThumbsDown, ThumbsUp } from "lucide-react"

function Saved({
  response: { storedActionResponses, unsaveResponse, sendFeedback },
  selectedActionGuid,
}: {
  response: IKluNextContext["response"]
  selectedActionGuid: IKluNextContext["action"]["selectedActionGuid"]
}) {
  const [selectedStoredActionResponses, _] = useInitialChange(
    storedActionResponses?.filter((r) => r.actionGuid === selectedActionGuid) ??
      [],
    [selectedActionGuid, storedActionResponses]
  )

  if (!storedActionResponses || selectedStoredActionResponses.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <div className="flex flex-col gap-[10px] m-auto text-center w-2/3">
          <div className="flex justify-center mb-4">
            <Bookmark className="inline-grid"/>
          </div>
          <p className="text-[14px] font-medium opacity-80">
            Your Saved Generations
          </p>
          <p className="text-[14px] opacity-50">
            Saved generations will appear here
          </p>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col gap-[10px] my-[20px]">
      {selectedStoredActionResponses.map((r) => (
        <div
          key={r.actionGuid}
          className="flex flex-col gap-[5px] bg-off-white p-4 rounded-md border-black/10 border-[1px]"
        >
          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="item-1">
              <Accordion.Trigger className="text-sm">Input</Accordion.Trigger>
              <Accordion.Content className="text-sm">
                <div className="flex flex-col gap-[5px] border-black/10 border-[1px] rounded-md bg-white p-[12px]">
                  {isObject(r.input)
                    ? Object.entries(r.input).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex w-full flex-col gap-[3px]"
                        >
                          <Code className="text-[10px] w-fit lowercase p-[1px]">
                            {key}
                          </Code>
                          <p className="text-[12px] h-fit">{value}</p>
                        </div>
                      ))
                    : r.input}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="item-1">
              <Accordion.Trigger className="text-sm">
                Response
              </Accordion.Trigger>
              <Accordion.Content className="text-sm">
                <div className="border-black/10 border-[1px] rounded-md bg-white p-4 h-[300px] overflow-y-auto scroll-stable scroll-smooth">
                  <Markdown text={r.msg} />
                </div>
                <div className="flex items-center w-full mt-[10px] justify-between">
                  <div className="flex items-center gap-[10px]">
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
                      icon={{ icon: BookmarkMinus }}
                      onClick={() => unsaveResponse(r)}
                    >
                      Unsave
                    </Button>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <Button
                      variant="secondary"
                      onClick={async () =>
                        await sendFeedback(r.data_guid, "positive")
                      }
                      icon={{ icon: ThumbsUp }}
                      size={"sm"}
                      className={
                        r.isPositive
                          ? "text-green-500 bg-green-50 border-green-300 hover:bg-green-100"
                          : ""
                      }
                    />
                    <Button
                      variant="secondary"
                      onClick={async () =>
                        await sendFeedback(r.data_guid, "negative")
                      }
                      icon={{ icon: ThumbsDown }}
                      className={
                        r.isNegative
                          ? "text-red-500 bg-red-50 border-red-300 hover:bg-red-100"
                          : ""
                      }
                      size={"sm"}
                    />
                  </div>
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
