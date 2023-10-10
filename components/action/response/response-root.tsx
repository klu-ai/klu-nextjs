import { cn } from "@/utils"

const Root = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={cn(
        "xl:w-2/3 w-full border-r-black/10 border-r-[1px] bg-off-white text-black md:p-12 p-6  flex flex-col gap-[20px] overflow-y-auto xl:h-screen h-full xl:border-t-[0px] border-t-[1px] border-t-black/10",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export { Root }
