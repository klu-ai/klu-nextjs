"use client"

import { useKluNext } from "@/app/provider"
import { Skeleton } from "@/components/ui/skeleton"
import * as Tabs from "@/components/ui/tabs"
import useMounted from "@/hooks/use-mounted"
import { RunOnce } from "./menu-run-once"
import { Saved } from "./menu-saved"
import { RunBatch } from "./menu-run-batch"

function MenuAndContent() {
  const {
    action: { selectedAction },
    response,
  } = useKluNext()

  const isMounted = useMounted()

  if (!isMounted)
    return (
      <div className="flex flex-col gap-[10px]">
        <Skeleton className="h-[30px] w-full mb-[10px]" />
        <Skeleton className="h-[20px] w-1/3" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[40px] w-full" />
        <Skeleton className="h-[40px] w-full" />
      </div>
    )

  if (!selectedAction)
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <div className="flex flex-col gap-[10px] m-auto text-center w-2/3">
          <p className="text-[14px] font-medium opacity-80">
            No Selected Action
          </p>
          <p className="text-[14px] opacity-50">
            Please select your saved action in the dropdown menu or save a new
            action
          </p>
        </div>
      </div>
    )

  return (
    <Tabs.Root defaultValue="run-once" className="w-full h-full">
      <Tabs.List>
        <Tabs.Trigger value="run-once">Run Once</Tabs.Trigger>
        <Tabs.Trigger value="run-batch">Run Batch</Tabs.Trigger>
        <Tabs.Trigger value="saved">Saved</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="run-once">
        <RunOnce selectedAction={selectedAction} />
      </Tabs.Content>
      <Tabs.Content value="run-batch">
        <RunBatch selectedAction={selectedAction} />
      </Tabs.Content>
      <Tabs.Content value="saved">
        <Saved response={response} selectedActionGuid={selectedAction.guid} />
      </Tabs.Content>
    </Tabs.Root>
  )
}

export { MenuAndContent }
