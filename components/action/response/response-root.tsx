import { cn } from "@/utils"

const Root = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={cn(
        "w-2/3 border-r-black/10 border-r-[1px] bg-off-white text-black p-12 flex flex-col gap-[20px] overflow-y-auto h-screen",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export { Root }
