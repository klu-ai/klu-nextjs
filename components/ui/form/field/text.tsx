import { useDescription, useFieldInfo, useTsController } from "@ts-react/form"
import { Base } from "./base"
import { Input } from "../../input"

function Text() {
  const { field, error } = useTsController<string>()
  const { label, placeholder } = useDescription()
  const { isOptional } = useFieldInfo()

  return (
    <Base required={!isOptional} label={label} error={error?.errorMessage}>
      <Input
        type="text"
        placeholder={placeholder}
        value={field.value ?? ""}
        onChange={(e) => void field.onChange(e.target.value)}
      />
    </Base>
  )
}

export { Text }
