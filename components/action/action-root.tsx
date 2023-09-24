import { cn } from "@/utils"

const Root = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <main className={cn("flex min-h-screen flex-row", className)} {...props}>
      {children}
    </main>
  )
}

export { Root }
