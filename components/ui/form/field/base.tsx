function Base({
  label,
  required,
  children,
  button,
  error,
}: {
  children: React.ReactNode
  button?: React.ReactNode
  required: boolean
  label?: string
  error?: string
}) {
  return (
    <div className="relative flex w-full flex-col gap-[8px]">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          <span>{label}</span>
          {required && <span className="ml-[3px] text-red-500">*</span>}
        </label>
      )}
      <div className="flex h-full gap-[5px]">
        {children}
        {button && (
          <div className="h-full rounded-md border-[1px] border-black/10 bg-white text-opacity-30 transition hover:bg-gray-50 hover:text-opacity-50">
            {button}
          </div>
        )}
      </div>

      {error && <span className="-mt-[5px] text-xs text-red-500">{error}</span>}
    </div>
  )
}

export { Base }
