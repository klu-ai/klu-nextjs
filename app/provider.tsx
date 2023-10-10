"use client"

import { ActionResponse, StoredAction, StoredActionResponse } from "@/types"
import { useLocalStorage } from "@/hooks/use-localstorage"
import {
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Toaster, toast } from "sonner"
import { env } from "@/env.mjs"
import { fetchAction, postActionResponse } from "@/utils/klu"
import { now } from "@/utils"

type SetState<T> = React.Dispatch<SetStateAction<T>>

export type AppStateType = "run-once" | "run-batch" | "saved"

export interface IKluNextContext {
  action: {
    selectedActionGuid: string | undefined
    selectedAction: StoredAction | undefined
    setSelectedActionGuid: SetState<string | undefined>
    isFetching: boolean
  }
  response: {
    actionResponses: Array<ActionResponse>
    setActionResponses: SetState<Array<ActionResponse>>
    storedActionResponses:
      | ReturnType<typeof useLocalStorage<StoredActionResponse[]>>["data"]
      | undefined
    saveResponse: (response: ActionResponse) => void
    unsaveResponse: (response: ActionResponse) => void
    generate: (
      values: any,
      config?: { regenerate?: boolean; runBatch?: boolean }
    ) => Promise<void>
  }
  state: {
    value: AppStateType
    setValue: SetState<AppStateType>
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
    actionResponses: [],
    setActionResponses: () => {},
    storedActionResponses: undefined,
    saveResponse: () => {},
    unsaveResponse: () => {},
    generate: async () => {},
  },
  state: {
    value: "run-once",
    setValue: () => {},
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

  const { data: stateValue, save: setStateValue } =
    useLocalStorage<AppStateType>("klu-nextjs-state", "run-once")

  const [selectedAction, setSelectedAction] = useState<StoredAction>()

  const [selectedActionGuid, setSelectedActionGuid] =
    useState<IKluNextContext["action"]["selectedActionGuid"]>()

  const [actionResponses, setActionResponses] = useState<
    IKluNextContext["response"]["actionResponses"]
  >([])

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
      .catch(e)
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

  const generate = async (
    values: any,
    config?: { regenerate?: boolean; runBatch?: boolean }
  ) => {
    if (!selectedActionGuid) throw new Error("Please select action first")

    const res = await postActionResponse<
      Omit<ActionResponse, "actionGuid" | "input">
    >(selectedActionGuid, values)

    if (!res.data_guid) throw new Error("There's an error")

    const actionResponse: ActionResponse = {
      ...res,
      actionGuid: selectedActionGuid,
      input: values,
    }

    if (config?.regenerate) {
      setActionResponses((prev) => [
        ...prev.map((a) => (a.input === values ? actionResponse : a)),
      ])
      return
    }

    setActionResponses((prev) => [actionResponse, ...prev])

    return
  }

  const saveResponse = useCallback(
    (response: ActionResponse) => {
      const storedActionResponse: StoredActionResponse = {
        ...response,
        storedAt: now(),
      }

      setStoredActionResponses((prev) => [storedActionResponse, ...prev])
      toast.success("Response is saved")
    },
    [setStoredActionResponses]
  )

  const unsaveResponse = (response: ActionResponse) => {
    const newStoredActionResponse = storedActionResponses.filter(
      (r) => r.data_guid !== response.data_guid
    )
    setStoredActionResponses(newStoredActionResponse)
    toast.success("Response is removed from your saved")
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
          actionResponses,
          storedActionResponses,
          setActionResponses,
          saveResponse,
          unsaveResponse,
          generate,
        },
        state: {
          value: stateValue,
          setValue: setStateValue,
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
