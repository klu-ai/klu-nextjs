"use client"

import { useKluNext } from "@/app/provider"
import { Button } from "@/components/ui/button"
import * as Dropzone from "@/components/ui/dropzone"
import useInitialChange from "@/hooks/use-initialchange"
import { ActionResponse, StoredAction } from "@/types"
import { handleClientError } from "@/utils/error"
import { postActionResponse } from "@/utils/fetcher"
import {
  CheckCircle,
  CircleDashed,
  Download,
  PlayCircle,
  Trash,
  XCircle,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

function RunBatch({ selectedAction }: { selectedAction: StoredAction }) {
  const [isRunning, setRunning] = useState(false)

  const {
    response: { setActionResponses },
  } = useKluNext()

  const [responseBatchDoneCount, setResponseBatchDoneCount] = useState(0)

  const [selectedActionVariables] = useInitialChange(
    selectedAction.variables.length > 0 ? selectedAction.variables : ["Input"],
    [selectedAction]
  )

  const [uploadedCSVHeaders, setUploadedCSVHeaders] = useState<Array<string>>()

  const [file, setFile] = useState<{
    name: File["name"]
    isUploaded: boolean
    isHeadersValid: boolean
    inputs: Array<{
      [key: string]: string
    }>
  }>()

  useEffect(() => {
    if (
      !file?.isUploaded ||
      selectedAction.variables.length === uploadedCSVHeaders?.length
    )
      return
    /* Reset file when selecetd action changes */
    setFile(undefined)
  }, [selectedAction])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0]

        const fileUrl = URL.createObjectURL(file)

        const response = await fetch(fileUrl)

        const text = await response.text()

        // Split the text by newline
        const lines = text.split("\n")

        // Map through all the lines and split each line by comma.
        const data = lines.map((line) =>
          line
            .trim()
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((x) => x.trim())
        )

        const isHeadersValid =
          selectedActionVariables.filter((x) => !data[0].includes(x)).length ===
          0

        if (!isHeadersValid) throw new Error("Header is invalid")

        setUploadedCSVHeaders(data[0])

        const inputs: { [key: string]: string }[] = data
          .slice(1)
          .map((item) => {
            const obj: { [key: string]: string } = {}

            data[0].forEach((key, index) => {
              if (item[index] !== undefined && item[index] !== "") {
                obj[key] = item[index]
              }
            })

            return obj
          })
          .filter((obj) => Object.keys(obj).length > 0)

        setFile({
          name: file.name,
          isUploaded: true,
          isHeadersValid,
          inputs,
        })

        toast.success("File is loaded")
      } catch (e) {
        toast.error((e as Error).message)
      }
    },
    [selectedActionVariables]
  )

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

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "text/csv": [".csv"],
      },
      maxFiles: 1,
      onDrop,
    })

  async function runActionOnBatch() {
    if (!file || !uploadedCSVHeaders || uploadedCSVHeaders.length == 0) return

    setRunning(true)
    try {
      const batchSize = 5
      const totalBatches = Math.ceil(file.inputs.length / batchSize)

      for (let i = 0; i < totalBatches; i++) {
        const startIndex = i * batchSize
        const endIndex = startIndex + batchSize
        const batchInputs = file.inputs.slice(startIndex, endIndex)

        await Promise.allSettled(
          batchInputs.map(async (value) => {
            const response = await postActionResponse<
              Omit<ActionResponse, "actionGuid" | "input">
            >(selectedAction.guid, value)
            const actionResponse: ActionResponse = {
              ...response,
              actionGuid: selectedAction.guid,
              input: value as any,
            }

            setResponseBatchDoneCount((prev) => prev + 1)

            setActionResponses((prev) => [actionResponse, ...prev])

            return actionResponse
          })
        )
      }
    } catch (error) {
      return handleClientError(error)
    }
  }

  return (
    <div className="flex flex-col gap-[20px] my-[20px]">
      <div className="flex flex-col text-[14px] gap-[5px]">
        <p className="font-medium ">
          The CSV file must have the following headers:
        </p>
        <div className="flex flex-col gap-[5px]">
          {selectedActionVariables.map((x, i) => (
            <div className="flex items-center w-full gap-[5px]" key={i}>
              {file?.isUploaded ? (
                uploadedCSVHeaders &&
                (uploadedCSVHeaders.find((a) => a === x) ? (
                  <CheckCircle size={12} className="text-green-600" />
                ) : (
                  <XCircle size={12} className="text-red-600" />
                ))
              ) : (
                <CircleDashed size={12} className="opacity-50" />
              )}
              <p>{x}</p>
              {file?.isUploaded &&
                uploadedCSVHeaders &&
                (uploadedCSVHeaders.find((a) => a === x) ? (
                  <p className="text-green-500 text-right ml-auto">Available</p>
                ) : (
                  <p className="text-red-600 text-right ml-auto">Missing</p>
                ))}
            </div>
          ))}
        </div>
      </div>
      <Dropzone.Root {...getRootProps()}>
        <Dropzone.Input {...getInputProps()} />
        <Dropzone.Content
          file={{ name: file?.name, acceptedTypes: [".csv"] }}
          state={{
            isDragAccept,
            isDragReject,
            isUploaded: file?.isUploaded ?? false,
          }}
        />
      </Dropzone.Root>
      <div className="flex flex-col gap-[10px]">
        <Button
          disabled={
            !file?.isHeadersValid || file?.inputs.length === 0 || isRunning
          }
          className="w-full"
          icon={{ icon: PlayCircle }}
          onClick={runActionOnBatch}
          isLoading={isRunning}
        >
          {file?.inputs && !isRunning
            ? `Run ${file.inputs.length} Inputs`
            : isRunning
            ? `Running ${
                file?.inputs.length! - responseBatchDoneCount
              } Remaining`
            : "Run Batch"}
        </Button>
        <Button
          variant="secondary"
          disabled={!file || isRunning}
          className="w-full"
          icon={{ icon: Trash }}
          onClick={() => setFile(undefined)}
        >
          Delete File
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
