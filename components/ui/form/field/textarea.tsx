import { useDescription, useFieldInfo, useTsController } from "@ts-react/form"
import { Textarea } from "../../textarea"
import { Base } from "./base"

function TextArea() {
  const { field, error } = useTsController<string>()
  const { label, placeholder } = useDescription()
  const { isOptional } = useFieldInfo()

  return (
    <Base required={!isOptional} label={label} error={error?.errorMessage}>
      <Textarea
        placeholder={placeholder}
        value={field.value ?? ""}
        onChange={(e) => void field.onChange(e.target.value)}
      />
    </Base>
  )
}

export { TextArea }
