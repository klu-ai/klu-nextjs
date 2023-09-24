"use client"

import { ActionResponse, StoredAction, StoredActionResponse } from "@/types"
import { useLocalStorage } from "@/hooks/use-localstorage"
import {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { Toaster, toast } from "sonner"
import { env } from "@/env.mjs"
import { fetchAction } from "@/utils/klu"
import { now } from "@/utils"

type SetState<T> = React.Dispatch<SetStateAction<T>>

export interface IKluNextContext {
  action: {
    selectedActionGuid: string | undefined
    selectedAction: StoredAction | undefined
    setSelectedActionGuid: SetState<string | undefined>
    isFetching: boolean
  }
  response: {
    selectedActionResponse: ActionResponse | undefined
    setSelectedActionResponse: SetState<ActionResponse | undefined>
    storedActionResponses:
      | ReturnType<typeof useLocalStorage<StoredActionResponse[]>>["data"]
      | undefined
    setStoredActionResponses: ReturnType<
      typeof useLocalStorage<StoredActionResponse[]>
    >["save"]
    generate: (values: any) => Promise<void>
  }
}

const KluNextContextImpl = createContext<IKluNextContext>({
  action: {
    selectedActionGuid: undefined,
    selectedAction: undefined,
    setSelectedActionGuid: () => {},
    isFetching: false,
  },
  response: {
    selectedActionResponse: undefined,
    setSelectedActionResponse: () => {},
    storedActionResponses: undefined,
    setStoredActionResponses: () => {},
    generate: async () => {},
  },
})

export function useKluNext() {
  return useContext(KluNextContextImpl)
}

export default function KluProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: storedActions, save: storeActions } = useLocalStorage<
    StoredAction[]
  >("klu-nextjs-actions", [])
  const { data: storedSelectedActionGuid, save: storeSelectedActionGuid } =
    useLocalStorage<string>("klu-nextjs-selected-action", "")

  const [selectedAction, setSelectedAction] = useState<StoredAction>()

  const [selectedActionGuid, setSelectedActionGuid] =
    useState<IKluNextContext["action"]["selectedActionGuid"]>()

  const [selectedActionResponse, setSelectedActionResponse] =
    useState<ActionResponse>()

  const { data: storedActionResponses, save: setStoredActionResponses } =
    useLocalStorage<StoredActionResponse[]>("klu-nextjs-action-response", [])

  const [isFetchingAction, setFetchingAction] = useState(false)

  useEffect(function loadInitialAction() {
    setFetchingAction(true)
    const initialActionGuid = env.NEXT_PUBLIC_KLU_ACTION_GUID

    if (!initialActionGuid) {
      setFetchingAction(false)
      return
    }

    const initialActionGuidIsExist = storedActions.find(
      (a) => a.guid === initialActionGuid
    )

    if (initialActionGuidIsExist) {
      setFetchingAction(false)
      return
    }

    fetchAction(initialActionGuid)
      .then((a) => {
        if (!a.guid) {
          throw new Error("Action GUID is invalid. Please try again")
        }
        const initialAction: StoredAction = {
          ...a,
          storedAt: now(),
          revalidatedAt: now(),
        }

        storeActions((prev) => [initialAction, ...prev])
        setSelectedActionGuid(initialActionGuid)
      })
      .catch((e) => toast.error((e as Error).message))
      .finally(() => setFetchingAction(false))
  }, [])

  useEffect(function loadStoredActionsData() {
    if (storedActions.length === 0 || !storedActions) return

    if (storedSelectedActionGuid) {
      const storedSelectedAction = storedActions.find(
        (a) => a.guid === storedSelectedActionGuid
      )
      if (!storedSelectedAction) return
      setSelectedActionGuid(storedSelectedAction.guid)
      setSelectedAction(storedSelectedAction)
      return
    }

    const initialSelectedAction = storedActions[0]

    setSelectedActionGuid(initialSelectedAction.guid)
    setSelectedAction(initialSelectedAction)
  }, [])

  useEffect(
    function onChangeSelectedAction() {
      if (!selectedActionGuid) return

      storeSelectedActionGuid(selectedActionGuid)

      const selectedStoredAction = storedActions.find(
        (x) => x.guid === selectedActionGuid
      )

      setSelectedAction(selectedStoredAction)
    },
    [selectedActionGuid, storedActions]
  )

  const generate = async (values: any) => {
    if (!selectedActionGuid) throw new Error("Please select action first")
    const req = await fetch(`/api/action`, {
      method: "POST",
      body: JSON.stringify({
        id: selectedActionGuid,
        input: values,
      }),
    })

    const res = (await req.json()) as unknown as Omit<
      ActionResponse,
      "actionGuid" | "input"
    >

    if (!res.data_guid) throw new Error("There's an error")

    const actionResponse: ActionResponse = {
      ...res,
      actionGuid: selectedActionGuid,
      input: values,
    }

    setSelectedActionResponse(actionResponse)

    return
  }

  return (
    <KluNextContextImpl.Provider
      value={{
        action: {
          selectedActionGuid,
          selectedAction,
          setSelectedActionGuid,
          isFetching: isFetchingAction,
        },
        response: {
          selectedActionResponse,
          setSelectedActionResponse,
          storedActionResponses,
          setStoredActionResponses,
          generate,
        },
      }}
    >
      <>
        <Toaster richColors closeButton position="bottom-right" />
        {children}
      </>
    </KluNextContextImpl.Provider>
  )
}
