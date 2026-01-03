import { AirtableConfigError, AirtableNotFoundError, AirtableResponseError } from './errors'
import type { AirtableErrorPayload, AirtableListResponse, AirtableRecord } from './types'

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0'

type AirtableRequestOptions = {
  table: string
  recordId?: string
  method?: 'GET' | 'PATCH'
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
}

function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!apiKey) throw new AirtableConfigError('Missing AIRTABLE_API_KEY')
  if (!baseId) throw new AirtableConfigError('Missing AIRTABLE_BASE_ID')

  return { apiKey, baseId }
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

function getRetryDelayMs(attemptIndex: number) {
  const base = 250 * 2 ** attemptIndex
  const jitter = Math.floor(Math.random() * 100)
  return base + jitter
}

function shouldRetry(status: number) {
  return status === 429 || (status >= 500 && status <= 599)
}

async function parseAirtableErrorPayload(response: Response): Promise<AirtableErrorPayload | null> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return null
  try {
    return (await response.json()) as AirtableErrorPayload
  } catch {
    return null
  }
}

function buildUrl({ baseId, table, recordId, query }: { baseId: string } & AirtableRequestOptions) {
  const encodedTable = encodeURIComponent(table)
  const encodedRecordId = recordId ? `/${encodeURIComponent(recordId)}` : ''
  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodedTable}${encodedRecordId}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

export async function airtableRequestJson<T>(options: AirtableRequestOptions): Promise<T> {
  const { apiKey, baseId } = getAirtableConfig()

  const url = buildUrl({ baseId, ...options })
  const method = options.method ?? 'GET'

  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        method,
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      })

      if (response.ok) return (await response.json()) as T

      if (response.status === 404) {
        throw new AirtableNotFoundError('Airtable record not found', {
          table: options.table,
          recordId: options.recordId,
        })
      }

      const errorPayload = await parseAirtableErrorPayload(response)
      const airtableType =
        errorPayload && 'error' in errorPayload && typeof errorPayload.error === 'object'
          ? errorPayload.error.type
          : undefined
      const airtableMessage =
        errorPayload && 'error' in errorPayload && typeof errorPayload.error === 'object'
          ? errorPayload.error.message
          : typeof errorPayload?.error === 'string'
            ? errorPayload.error
            : undefined

      if (attempt < 2 && shouldRetry(response.status)) {
        const retryAfter = response.headers.get('retry-after')
        const delayMs = retryAfter ? Number(retryAfter) * 1000 : getRetryDelayMs(attempt)
        await sleep(Number.isFinite(delayMs) ? delayMs : getRetryDelayMs(attempt))
        continue
      }

      throw new AirtableResponseError(
        airtableMessage ?? `Airtable request failed (${response.status})`,
        {
          status: response.status,
          statusText: response.statusText,
          airtableType,
          airtableMessage,
          table: options.table,
          recordId: options.recordId,
        },
      )
    } catch (error) {
      lastError = error
      if (error instanceof AirtableNotFoundError) throw error
      if (error instanceof AirtableResponseError) throw error
      if (attempt < 2) {
        await sleep(getRetryDelayMs(attempt))
        continue
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Airtable request failed')
}

export async function airtableListAll<TFields extends Record<string, unknown>>(
  table: string,
  query?: AirtableRequestOptions['query'],
) {
  const records: AirtableRecord<TFields>[] = []
  let offset: string | undefined
  do {
    const response = await airtableRequestJson<AirtableListResponse<TFields>>({
      table,
      query: { pageSize: 100, ...query, offset },
      method: 'GET',
    })
    records.push(...response.records)
    offset = response.offset
  } while (offset)
  return records
}

