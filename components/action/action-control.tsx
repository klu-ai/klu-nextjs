import { cn } from "@/utils"

const Control = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={cn(
        "xl:w-1/3 w-full border-r-black/10 border-r-[1px] bg-white text-black md:p-12 p-6 flex flex-col gap-[20px] xl:h-screen min-h-[30vh] overflow-y-auto scroll-smooth scroll-stable",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export { Control }
