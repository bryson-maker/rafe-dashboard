'use server'

import {
  getAuditLog as getAuditLogImpl,
  getClientById as getClientByIdImpl,
  getClients as getClientsImpl,
  getContentLibrary as getContentLibraryImpl,
  getKeywords as getKeywordsImpl,
  updateClientStatus as updateClientStatusImpl,
  type ClientStatus,
} from '@/lib/airtable'

export type { ClientStatus }

export async function getClients() {
  return getClientsImpl()
}

export async function getClientById(id: string) {
  return getClientByIdImpl(id)
}

export async function updateClientStatus(id: string, status: ClientStatus) {
  return updateClientStatusImpl(id, status)
}

export async function getKeywords(clientId: string) {
  return getKeywordsImpl(clientId)
}

export async function getContentLibrary(clientId: string) {
  return getContentLibraryImpl(clientId)
}

export async function getAuditLog(clientId: string) {
  return getAuditLogImpl(clientId)
}

