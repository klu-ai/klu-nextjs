import { cn } from "@/utils"
import {
  File,
  FileCheck,
  FileX,
  LucideIcon,
  Upload,
  UploadCloud,
} from "lucide-react"
import React from "react"

const Root = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return <input ref={ref} {...props} />
})

type DropzoneContentState = "isDragReject" | "isDragAccept" | "isUploaded"

type DropzoneContentProps = React.HTMLAttributes<HTMLDivElement> & {
  state: { [K in DropzoneContentState]: boolean }
  file: {
    acceptedTypes: Array<string>
    name: File["name"] | undefined
  }
}

const Content = ({
  state,
  className,
  file,
  ...props
}: DropzoneContentProps) => {
  return (
    <div
      {...props}
      className={cn(
        "w-full h-[300px] border-[2px] border-dashed flex flex-col rounded-md transition group",
        {
          "border-green-500/50 text-green-500 hover:border-green-500 bg-green-500/5 hover:bg-green-500/10 hover:border-dashed border-solid hover:cursor-pointer":
            state.isUploaded,
          "border-red-500 text-red-500 bg-red-500/[0.02]": state.isDragReject,
          "border-green-500 text-green-500 bg-green-500/[0.02]":
            state.isDragAccept,
          "border-black/10 hover:border-black/50 hover:bg-black/[0.0125] hover:cursor-pointer bg-off-white":
            !state.isDragReject && !state.isDragAccept && !state.isUploaded,
        },
        className
      )}
    >
      <div className="flex flex-col gap-[10px] w-2/3 text-center m-auto items-center">
        {state.isUploaded ? (
          <>
            <div className="border-[1px] border-green-500/50 rounded-md p-[10px] transition bg-green-100/50">
              <File />
            </div>
            <div className="flex flex-col text-[14px] mt-[10px]">
              <p className="font-medium">{file.name}</p>
              <p className="opacity-50">click to change</p>
            </div>
            <p className="flex flex-col opacity-50 text-[12px]">
              supported file: {file.acceptedTypes.join(", ")}
            </p>
          </>
        ) : state.isDragAccept ? (
          <>
            <FileCheck />
            <div className="flex flex-col text-[14px] mt-[10px]">
              <p className="font-medium">File can be uploaded</p>
            </div>
          </>
        ) : state.isDragReject ? (
          <>
            <FileX />
            <div className="flex flex-col text-[14px] mt-[10px]">
              <p className="font-medium">File type isn`t supported</p>
            </div>
            <p className="flex flex-col opacity-50 text-[12px] text-black">
              supported file: {file.acceptedTypes.join(", ")}
            </p>
          </>
        ) : (
          <>
            <div className="border-[1px] border-black/20 rounded-md p-[10px] group-hover:border-black/50 transition bg-white">
              <UploadCloud className="opacity-50 transition group-hover:opacity-80" />
            </div>
            <div className="flex flex-col text-[14px] mt-[10px]">
              <p className="font-medium">Click to upload a file</p>
              <p className="opacity-50">or drag and drop here</p>
            </div>
            <p className="flex flex-col opacity-50 text-[12px] text-black">
              supported file: {file.acceptedTypes.join(", ")}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

Input.displayName = "Input"

export { Root, Input, Content }
