export type AirtableRecord<TFields extends Record<string, unknown>> = {
  id: string
  createdTime: string
  fields: TFields
}

export type AirtableListResponse<TFields extends Record<string, unknown>> = {
  records: AirtableRecord<TFields>[]
  offset?: string
}

export type AirtableErrorPayload =
  | { error: { type: string; message: string } }
  | { error: string }

export type AirtableEntity<TFields extends Record<string, unknown>> = {
  id: string
  createdTime: string
} & TFields

