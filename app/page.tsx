import * as Action from "@/components/action"

export default function Home() {
  return (
    <Action.Root>
      <Action.Control>
        <Action.Head />
        <Action.MenuAndContent />
      </Action.Control>
      <Action.Response.Root>
        <Action.Response.Content />
      </Action.Response.Root>
    </Action.Root>
  )
}
