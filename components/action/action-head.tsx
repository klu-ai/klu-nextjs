"use client"

import { Button } from "@/components/ui/button"
import * as Select from "@/components/ui/select"
import { Box, Plus, Trash } from "lucide-react"
import { useState } from "react"
import * as Dialog from "@/components/ui/dialog"
import { StringSchema } from "../ui/form/schema"
import { Form } from "../ui/form"
import { z } from "zod"
import { toast } from "sonner"
import { useLocalStorage } from "@/hooks/use-localstorage"
import { now } from "@/utils"
import { useKluNext } from "@/app/provider"
import useMounted from "@/hooks/use-mounted"
import { Skeleton } from "../ui/skeleton"
import { Action, StoredAction } from "@/type"
import { fetchAction } from "@/utils/klu"

const ActionGUIDSchema = z.object({
  actionGuid: StringSchema({
    label: "Action GUID",
    placeholder: "841e5951-5e09-4d96-ba8d-58401fb9e47a",
  }),
})

type ActionGUIDSchemaType = z.infer<typeof ActionGUIDSchema>

function Head() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [isAddingAction, setAddingAction] = useState(false)

  const {
    action: { selectedActionGuid, setSelectedActionGuid, isFetching },
  } = useKluNext()
  const { data: storedActions, save: setStoredActions } = useLocalStorage<
    StoredAction[]
  >("klu-nextjs-actions", [])

  const isMounted = useMounted()

  async function addAction({ actionGuid }: ActionGUIDSchemaType) {
    const existingAction = storedActions.find((a) => a.guid === actionGuid)

    if (existingAction) {
      toast.error("Action is already saved")
      return
    }
    setAddingAction(true)

    const data = await fetchAction(actionGuid)

    if (!data.guid) {
      toast.error("Action GUID is invalid. Please try again")
      setAddingAction(false)
      return
    }

    const action: StoredAction = {
      ...data,
      storedAt: now(),
      revalidatedAt: now(),
    }

    setStoredActions((prev) => [action, ...prev])
    setSelectedActionGuid(action.guid)
    setShowAddModal(false)
    setAddingAction(false)

    return
  }

  // TODO: Add edit and update feature

  return (
    <div className="flex items-center gap-[15px] w-full">
      <Box size={20} className="opacity-80" />

      <div className="flex items-center gap-[10px] w-full">
        {isMounted ? (
          <Select.Root
            onValueChange={setSelectedActionGuid}
            value={selectedActionGuid}
          >
            <Select.Trigger className="w-full" isLoading={isFetching}>
              <Select.Value placeholder="Select an action" />
            </Select.Trigger>
            <Select.Content>
              {storedActions.length === 0 ? (
                <div className="w-[200px] text-center mx-auto h-[100px] flex flex-col items-center justify-center px-[10px]">
                  <p className="text-[12px] font-medium">Empty</p>
                  <p className="text-[12px] opacity-50">
                    Please add action in the right side button
                  </p>
                </div>
              ) : (
                storedActions.map((item) => (
                  <Select.Item key={item.guid} value={item.guid}>
                    {item.name}
                  </Select.Item>
                ))
              )}
            </Select.Content>
          </Select.Root>
        ) : (
          <Skeleton className="w-full h-9" />
        )}

        <Button
          variant="secondary"
          icon={{ icon: Plus }}
          tooltip="Add action"
          onClick={() => setShowAddModal((prev) => !prev)}
        >
          {Boolean(selectedActionGuid) ? undefined : "Add"}
        </Button>
        {/*         {Boolean(selectedActionGuid) ? (
          <Button
            variant="destructive"
            icon={{ icon: Trash }}
            tooltip="Delete action"
            onClick={() => setShowAddModal((prev) => !prev)}
          />
        ) : undefined} */}
        <Dialog.Root open={showAddModal} onOpenChange={setShowAddModal}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add Action</Dialog.Title>
              <Dialog.Description>
                Add and save your action to local
              </Dialog.Description>
            </Dialog.Header>
            <Form
              schema={ActionGUIDSchema}
              onSubmit={addAction}
              formProps={{
                loading: isAddingAction,
                button: {
                  children: isAddingAction ? "Adding action" : "Add Action",
                  icon: { icon: Plus },
                },
              }}
            />
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </div>
  )
}

export { Head }
