"use client"

import { StoredAction } from "@/types"
import { cn } from "@/utils"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import * as Dropzone from "@/components/ui/dropzone"
import {
  CheckCircle,
  Circle,
  CircleDashed,
  Download,
  PlayCircle,
  Trash,
  UploadCloud,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

function RunBatch({ selectedAction }: { selectedAction: StoredAction }) {
  const [actionHaveVariables, setActionHaveVariables] = useState(
    selectedAction.variables.length > 0
  )

  const [state] = useState(["Company Name"])

  const [checked] = useState(false) // with file

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
    // Do something with the files
  }, [])

  const generateCSV = (
    variables: StoredAction["variables"],
    name: StoredAction["name"]
  ) => {
    const headers =
      variables.length > 0 ? variables.join(",") + `\n` : "Input\n"
    let el = document.createElement("a")
    el.href = "data:text/csv;charset=utf-8," + encodeURI(headers)
    el.target = "_blank"
    el.download = `klu_${name.replace(" ", "-").toLocaleLowerCase()}.csv`
    el.click()
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
    acceptedFiles,
  } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDrop,
  })

  return (
    <div className="flex flex-col gap-[20px] my-[20px]">
      <div className="flex flex-col text-[14px] gap-[5px]">
        <p className="font-medium ">
          The CSV file must have the following headers:
        </p>
        <div className="flex flex-col gap-[5px]">
          {selectedAction.variables.length > 0
            ? selectedAction.variables.map((x, i) => (
                <div className="flex items-center w-full gap-[5px]" key={i}>
                  {checked ? (
                    state.find((a) => a === x) ? (
                      <CheckCircle size={12} className="text-green-600" />
                    ) : (
                      <XCircle size={12} className="text-red-600" />
                    )
                  ) : (
                    <CircleDashed size={12} className="opacity-50" />
                  )}
                  <p>{x}</p>
                </div>
              ))
            : null}
        </div>
      </div>
      <Dropzone.Root {...getRootProps()}>
        <Dropzone.Input {...getInputProps()} />
        <Dropzone.Content
          fileTypes={[".csv"]}
          state={{ isDragAccept, isDragActive, isDragReject, isFocused }}
        />
      </Dropzone.Root>
      <div className="flex flex-col gap-[10px]">
        <Button
          /*       disabled={isRunning} */
          className="w-full"
          icon={{ icon: PlayCircle }}
          /*       onClick={clearActionForm} */
        >
          Run Batch
        </Button>
        <Button
          variant="secondary"
          /*       disabled={isRunning} */
          className="w-full"
          icon={{ icon: Trash }}
          /*       onClick={clearActionForm} */
        >
          Clear Values
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            generateCSV(selectedAction.variables, selectedAction.name)
          }
          className="text-blue-500 hover:bg-blue-500/10 transition"
          icon={{ icon: Download }}
        >
          Download CSV Template
        </Button>
      </div>
    </div>
  )
}

export { RunBatch }
