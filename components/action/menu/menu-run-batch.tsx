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
import { toast } from "sonner"

function RunBatch({ selectedAction }: { selectedAction: StoredAction }) {
  const [selectedActionVariables, setSelectedActionVariables] = useState(
    selectedAction.variables.length > 0 ? selectedAction.variables : ["Input"]
  )

  const [uploadedCSVHeaders, setUploadedCSVHeaders] = useState<Array<string>>()

  const [file, setFile] = useState<{
    name: File["name"]
    isUploaded: boolean
    isHeadersValid: boolean
  }>()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log(acceptedFiles)
    try {
      const file = acceptedFiles[0]

      // 1. create url from the file
      const fileUrl = URL.createObjectURL(file)

      // 2. use fetch API to read the file
      const response = await fetch(fileUrl)

      // 3. get the text from the response
      const text = await response.text()

      console.log(text)

      // 4. split the text by newline
      const lines = text.split("\n")

      console.log(lines)

      // 5. map through all the lines and split each line by comma.
      const data = lines.map((line) =>
        line
          .trim()
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((x) => x.trim())
      )

      const isHeadersValid =
        selectedActionVariables.filter((x) => !data[0].includes(x)).length === 0

      if (!isHeadersValid) throw new Error("Header is invalid")

      setUploadedCSVHeaders(data[0])

      setFile({
        name: file.name,
        isUploaded: true,
        isHeadersValid,
      })

      toast.success("File is loaded")

      console.log(data[0])
    } catch (e) {
      toast.error((e as Error).message)
    }

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
          disabled={!file?.isHeadersValid}
          className="w-full"
          icon={{ icon: PlayCircle }}
          /*       onClick={clearActionForm} */
        >
          Run Batch
        </Button>
        <Button
          variant="secondary"
          disabled={!file}
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
