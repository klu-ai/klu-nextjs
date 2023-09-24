"use client"

import { useKluNext } from "@/app/provider"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { LongStringSchema } from "@/components/ui/form/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlayCircle, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { StoredAction } from "@/types"

function RunOnce({ selectedAction }: { selectedAction: StoredAction }) {
  const [isRunning, setRunning] = useState(false)

  const {
    response: { generate },
  } = useKluNext()

  const [actionHaveVariables, setActionHaveVariables] = useState(
    selectedAction.variables.length > 0
  )

  useEffect(
    () => setActionHaveVariables(selectedAction.variables.length > 0),
    [selectedAction]
  )

  const parsedActionWithVariables = selectedAction.variables.map((item) => ({
    name: item,
    fieldType: LongStringSchema({
      label: item,
      placeholder: `Your value for "${item}" variable`,
    }),
  }))

  const ActionWithNoVariableSchema = z.object({
    input: LongStringSchema({
      label: "Input",
      placeholder: "Type your input here",
    }),
  })

  const ActionWithVariablesSchema = z.object(
    Object.fromEntries(
      parsedActionWithVariables.map((field) => [field.name, field.fieldType])
    )
  )

  const actionWithVariablesForm = useForm<
    z.infer<typeof ActionWithVariablesSchema>
  >({
    resolver: zodResolver(ActionWithVariablesSchema),
  })

  const actionWithNoVariableForm = useForm<
    z.infer<typeof ActionWithNoVariableSchema>
  >({
    resolver: zodResolver(ActionWithNoVariableSchema),
  })

  async function runActionOnce(
    values: { [key: string]: string } | { input: string }
  ) {
    setRunning(true)
    try {
      await generate(values.input ?? values)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setRunning(false)
    }
  }

  function clearActionForm() {
    if (actionHaveVariables) {
      actionWithVariablesForm.reset()
      toast.success(
        parsedActionWithVariables.length > 1
          ? "Values cleared"
          : "Value cleared"
      )
    } else {
      actionWithNoVariableForm.reset()
      toast.success("Value cleared")
    }
  }

  return (
    <>
      <Form
        schema={
          actionHaveVariables
            ? ActionWithVariablesSchema
            : ActionWithNoVariableSchema
        }
        form={
          actionHaveVariables
            ? actionWithVariablesForm
            : actionWithNoVariableForm
        }
        onSubmit={runActionOnce}
        formProps={{
          loading: isRunning,
          button: {
            children: isRunning ? "Running Action" : "Run Action",
            icon: { icon: PlayCircle },
          },
          className: "mt-[20px] capitalize",
        }}
      />
      <Button
        variant="secondary"
        disabled={isRunning}
        className="w-full mt-[10px] mb-[40px]"
        icon={{ icon: Trash }}
        onClick={clearActionForm}
      >
        Clear Values
      </Button>
    </>
  )
}

export { RunOnce }
