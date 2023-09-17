import { createUniqueFieldSchema } from "@ts-react/form"
import { z } from "zod"

interface FieldSchemaParams {
  label?: string
  placeholder?: string
}

interface RequiredFieldSchemaParams extends FieldSchemaParams {
  required?: string
}

export const BaseStringSchema = (params?: FieldSchemaParams) =>
  z.string().describe(`${params?.label} // ${params?.placeholder}`)

export const StringSchema = (params?: RequiredFieldSchemaParams) =>
  BaseStringSchema(params).min(1, params?.required ?? "Required")

export const LongStringSchema = (params?: RequiredFieldSchemaParams) =>
  createUniqueFieldSchema(
    BaseStringSchema(params).min(5, "Min. 5 character"),
    "textarea"
  )

export const OptionalStringSchema = (params?: FieldSchemaParams) =>
  BaseStringSchema(params).optional()

export const OptionalLongStringSchema = (params?: FieldSchemaParams) =>
  createUniqueFieldSchema(
    BaseStringSchema(params).optional().nullable(),
    "optional-textarea"
  )
