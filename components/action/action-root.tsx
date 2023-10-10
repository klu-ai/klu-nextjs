import { cn } from "@/utils"

const Root = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <main
      className={cn(
        "flex xl:min-h-screen xl:flex-row flex-col bg-off-white",
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
}

export { Root }
