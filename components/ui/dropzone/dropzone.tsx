import { cn } from "@/utils"
import { FileCheck, FileX, LucideIcon, Upload, UploadCloud } from "lucide-react"
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

type DropzoneContentState =
  | "isDragActive"
  | "isDragReject"
  | "isDragAccept"
  | "isFocused"

type DropzoneContentProps = React.HTMLAttributes<HTMLDivElement> & {
  state: { [K in DropzoneContentState]: boolean }
  fileTypes: Array<string>
}

const Content = ({
  state,
  className,
  fileTypes,
  ...props
}: DropzoneContentProps) => {
  return (
    <div
      {...props}
      className={cn(
        "w-full h-[300px] border-[1px] flex flex-col rounded-md transition group",
        {
          "border-red-500 text-red-500 hover:border-red-500 bg-red-500/[0.02]":
            state.isDragReject,
          "border-green-500 text-green-500 hover:border-green-500 bg-green-500/[0.02]":
            state.isDragAccept,
          "border-black/10 hover:border-black/50 hover:bg-black/[0.0125] hover:cursor-pointer bg-transparent":
            !state.isDragReject && !state.isDragAccept,
        },
        className
      )}
    >
      <div className="flex flex-col gap-[10px] w-2/3 text-center m-auto items-center">
        {state.isDragAccept ? (
          <>
            <FileCheck />
            <div className="flex flex-col text-[14px">
              <p className="font-medium">File can be uploaded</p>
            </div>
          </>
        ) : state.isDragReject ? (
          <>
            <FileX />
            <div className="flex flex-col text-[14px]">
              <p className="font-medium">File type isn`t supported</p>
            </div>
            <p className="flex flex-col opacity-50 text-[12px] text-black">
              supported file: {fileTypes.join(", ")}
            </p>
          </>
        ) : (
          <>
            <UploadCloud className="opacity-50 transition group-hover:opacity-100" />
            <div className="flex flex-col text-[14px]">
              <p className="font-medium">Click to upload a file</p>
              <p className="opacity-50">or drag and drop here</p>
            </div>
            <p className="flex flex-col opacity-50 text-[12px] text-black">
              supported file: {fileTypes.join(", ")}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

Input.displayName = "Input"

export { Root, Input, Content }
