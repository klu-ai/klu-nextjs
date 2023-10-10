"use client"

import { useKluNext } from "@/app/provider"
import { Button, ButtonProps } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { LongStringSchema } from "@/components/ui/form/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlayCircle, Trash } from "lucide-react"
import { ReactNode, RefAttributes, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { StoredAction } from "@/types"
import useInitialChange from "@/hooks/use-initialchange"

function RunOnce({ selectedAction }: { selectedAction: StoredAction }) {
  const [isRunning, setRunning] = useState(false)

  const {
    response: { generate },
  } = useKluNext()

  const [actionHaveVariables, setActionHaveVariables] = useInitialChange(
    selectedAction.variables.length > 0,
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

  const formProps: Omit<
    {
      onSubmit: () => void
      children: ReactNode
      loading: boolean
      button: ButtonProps & RefAttributes<HTMLButtonElement>
      className?: string | undefined
    },
    "children" | "onSubmit"
  > = {
    loading: isRunning,
    button: {
      children: isRunning ? "Running Action" : "Run Action",
      icon: { icon: PlayCircle },
    },
    className: "mt-[20px] capitalize",
  }

  const ClearValuesButton = () => (
    <Button
      variant="secondary"
      disabled={isRunning}
      className="w-full mt-[10px] mb-[40px]"
      icon={{ icon: Trash }}
      onClick={clearActionForm}
    >
      Clear Values
    </Button>
  )

  if (actionHaveVariables)
    return (
      <>
        <Form
          schema={ActionWithVariablesSchema}
          form={actionWithVariablesForm}
          onSubmit={runActionOnce}
          formProps={formProps}
        />
        <ClearValuesButton />
      </>
    )

  return (
    <>
      <Form
        schema={ActionWithNoVariableSchema}
        form={actionWithNoVariableForm}
        onSubmit={runActionOnce}
        formProps={formProps}
      />
      <ClearValuesButton />
    </>
  )
}

export { RunOnce }
