import { describe, it, expect, beforeEach } from 'vitest'
import clients from './mocks/fixtures/clients.json'
import keywords from './mocks/fixtures/keywords.json'
import contentLibrary from './mocks/fixtures/content-library.json'
import auditLog from './mocks/fixtures/audit-log.json'
import teamMembers from './mocks/fixtures/team-members.json'
import {
  getAuditLog,
  getClientById,
  getClients,
  getContentLibrary,
  getKeywords,
  updateClientStatus,
} from '@/lib/airtable'
import { AirtableNotFoundError } from '@/lib/airtable/errors'

beforeEach(() => {
  process.env.AIRTABLE_API_KEY = 'test-api-key'
  process.env.AIRTABLE_BASE_ID = 'base123'
})

describe('Airtable integration', () => {
  it('getClients returns all clients', async () => {
    const result = await getClients()
    expect(result).toHaveLength(clients.length)
    expect(result[0]).toHaveProperty('id')
  })

  it('getClientById returns a single client', async () => {
    const result = await getClientById('rec001')
    expect(result.id).toBe('rec001')
    expect(result.name).toBe('Acme Electrical')
  })

  it('getClientById throws for missing client', async () => {
    await expect(getClientById('does-not-exist')).rejects.toBeInstanceOf(AirtableNotFoundError)
  })

  it('updateClientStatus updates status', async () => {
    const result = await updateClientStatus('rec001', 'On Hold')
    expect(result.id).toBe('rec001')
    expect(result.status).toBe('On Hold')
  })

  it('getKeywords filters by clientId', async () => {
    const result = await getKeywords('rec001')
    const expected = keywords.filter(k => k.clientId === 'rec001')
    expect(result).toHaveLength(expected.length)
    expect(result.every(k => k.clientId === 'rec001')).toBe(true)
  })

  it('getContentLibrary filters by clientId', async () => {
    const result = await getContentLibrary('rec001')
    const expected = contentLibrary.filter(i => i.clientId === 'rec001')
    expect(result).toHaveLength(expected.length)
    expect(result.every(i => i.clientId === 'rec001')).toBe(true)
  })

  it('getAuditLog filters by clientId', async () => {
    const result = await getAuditLog('rec001')
    const expected = auditLog.filter(e => e.clientId === 'rec001')
    expect(result).toHaveLength(expected.length)
    expect(result.every(e => e.clientId === 'rec001')).toBe(true)
  })
})

