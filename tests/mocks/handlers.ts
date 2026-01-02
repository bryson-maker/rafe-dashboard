import { http, HttpResponse } from 'msw'
import clients from './fixtures/clients.json'
import checkpoints from './fixtures/checkpoints.json'
import keywords from './fixtures/keywords.json'

const AIRTABLE_BASE_URL = 'https://api.airtable.com/v0'

export const handlers = [
  // Get all clients
  http.get(`${AIRTABLE_BASE_URL}/:baseId/Clients`, () => {
    return HttpResponse.json({
      records: clients.map(client => ({
        id: client.id,
        fields: client,
        createdTime: new Date().toISOString(),
      })),
    })
  }),

  // Get single client
  http.get(`${AIRTABLE_BASE_URL}/:baseId/Clients/:recordId`, ({ params }) => {
    const client = clients.find(c => c.id === params.recordId)
    if (!client) {
      return HttpResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
    }
    return HttpResponse.json({
      id: client.id,
      fields: client,
      createdTime: new Date().toISOString(),
    })
  }),

  // Get checkpoints
  http.get(`${AIRTABLE_BASE_URL}/:baseId/Checkpoints`, () => {
    return HttpResponse.json({
      records: checkpoints.map(cp => ({
        id: cp.id,
        fields: cp,
        createdTime: new Date().toISOString(),
      })),
    })
  }),

  // Get keywords
  http.get(`${AIRTABLE_BASE_URL}/:baseId/Keywords`, () => {
    return HttpResponse.json({
      records: keywords.map(kw => ({
        id: kw.id,
        fields: kw,
        createdTime: new Date().toISOString(),
      })),
    })
  }),

  // Update client
  http.patch(`${AIRTABLE_BASE_URL}/:baseId/Clients/:recordId`, async ({ params, request }) => {
    const body = await request.json() as { fields: Record<string, unknown> }
    const client = clients.find(c => c.id === params.recordId)
    if (!client) {
      return HttpResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
    }
    return HttpResponse.json({
      id: client.id,
      fields: { ...client, ...body.fields },
      createdTime: new Date().toISOString(),
    })
  }),
]
