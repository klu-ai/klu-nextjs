"use client"

import { StoredAction } from "@/types"
import { cn } from "@/utils"
import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import * as Dropzone from "@/components/ui/dropzone"
import { UploadCloud } from "lucide-react"

function RunBatch({ selectedAction }: { selectedAction: StoredAction }) {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
    // Do something with the files
  }, [])

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
    <div className="flex flex-col gap-[10px] my-[20px]">
      <Dropzone.Root {...getRootProps()}>
        <Dropzone.Input {...getInputProps()} />
        <Dropzone.Content
          fileTypes={[".csv"]}
          state={{ isDragAccept, isDragActive, isDragReject, isFocused }}
        />
      </Dropzone.Root>
    </div>
  )
}

export { RunBatch }
