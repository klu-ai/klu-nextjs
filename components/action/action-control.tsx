import { cn } from "@/utils"

const Control = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={cn(
        "w-1/3 border-r-black/10 border-r-[1px] bg-white text-black p-12 flex flex-col gap-[20px] h-screen overflow-y-auto scroll-smooth scroll-stable",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export { Control }
