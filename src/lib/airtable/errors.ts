export class AirtableConfigError extends Error {
  readonly name = 'AirtableConfigError'
}

export class AirtableNotFoundError extends Error {
  readonly name = 'AirtableNotFoundError'

  constructor(
    message: string,
    readonly resource?: { table?: string; recordId?: string },
  ) {
    super(message)
  }
}

export class AirtableResponseError extends Error {
  readonly name = 'AirtableResponseError'

  constructor(
    message: string,
    readonly details: {
      status: number
      statusText: string
      airtableType?: string
      airtableMessage?: string
      table?: string
      recordId?: string
    },
  ) {
    super(message)
  }
}

