import type { AirtableEntity, AirtableRecord } from './types'
import { airtableListAll, airtableRequestJson } from './client'

export type { AirtableEntity, AirtableRecord } from './types'
export { AirtableConfigError, AirtableNotFoundError, AirtableResponseError } from './errors'

export type Client = AirtableEntity<ClientFields>
export type StatusTracking = AirtableEntity<StatusTrackingFields>
export type Checkpoint = AirtableEntity<CheckpointFields>
export type Keyword = AirtableEntity<KeywordFields>
export type ContentBrief = AirtableEntity<ContentBriefFields>
export type WebsiteBuild = AirtableEntity<WebsiteBuildFields>
export type GMBOptimization = AirtableEntity<GMBOptimizationFields>
export type ContentItem = AirtableEntity<ContentItemFields>
export type CitationTracking = AirtableEntity<CitationTrackingFields>
export type AuditLogEntry = AirtableEntity<AuditLogFields>

export type ClientStatus = ClientFields['status']

export type ClientFields = {
  id?: string
  name?: string
  status?:
    | 'Intake Pending'
    | 'Awaiting Intake Form'
    | 'Ready for Setup'
    | 'Phase 2 In Progress'
    | 'Ready for Website Build'
    | 'Website In Review'
    | 'Content In Review'
    | 'GMB In Progress'
    | 'Ready for Delivery'
    | 'Delivered'
    | 'On Hold'
    | 'Cancelled'
  currentCheckpoint?: string
  assignedOperator?: string | null
  dueDate?: string
  priority?: 'High' | 'Medium' | 'Low' | (string & {})
  totalKeywords?: number
  completedKeywords?: number
  city?: string
  state?: string
  phone?: string
  email?: string
  website?: string
  createdAt?: string
}

export type KeywordFields = {
  id?: string
  clientId?: string
  keyword?: string
  searchVolume?: number
  difficulty?: number
  status?: 'Approved' | 'Pending' | 'Completed' | (string & {})
  assignedPage?: string | null
}

export type ContentItemFields = {
  id?: string
  clientId?: string
  title?: string
  type?: string
  status?: string
  url?: string
  createdAt?: string
}

export type AuditLogFields = {
  id?: string
  clientId?: string
  action?: string
  actor?: string
  timestamp?: string
  metadata?: Record<string, unknown>
}

export type StatusTrackingFields = {
  id?: string
  clientId?: string
  phase?: string
  status?: string
  startDate?: string
  completionDate?: string
  notes?: string
}

export type CheckpointFields = {
  id?: string
  clientId?: string
  checkpoint?: 'CP1' | 'CP2' | 'CP3' | 'CP4' | 'CP5'
  status?: 'Pending' | 'In Review' | 'Approved' | 'Rejected'
  reviewDate?: string
  reviewer?: string
  feedback?: string
}

export type ContentBriefFields = {
  id?: string
  clientId?: string
  keywordId?: string
  briefUrl?: string
  status?: 'Pending' | 'In Progress' | 'Completed'
  createdAt?: string
}

export type WebsiteBuildFields = {
  id?: string
  clientId?: string
  buildStatus?: 'Not Started' | 'In Progress' | 'Ready for Review' | 'Deployed'
  deploymentUrl?: string
  deploymentDate?: string
  notes?: string
}

export type GMBOptimizationFields = {
  id?: string
  clientId?: string
  profileStatus?: 'Not Started' | 'In Progress' | 'Optimized'
  postingSchedule?: string
  lastOptimized?: string
  notes?: string
}

export type CitationTrackingFields = {
  id?: string
  clientId?: string
  directoryName?: string
  status?: 'Pending' | 'Submitted' | 'Live' | 'Rejected'
  submissionDate?: string
  liveUrl?: string
}

const TABLES = {
  clients: 'Clients',
  status_tracking: 'Status_Tracking',
  checkpoints: 'Checkpoints',
  keywords: 'DataForSEO_Keywords',
  content_briefs: 'Content_Briefs',
  website_builds: 'Website_Builds',
  gmb_optimization: 'GMB_Optimization',
  content_library: 'Content_Library',
  citation_tracking: 'Citation_Tracking',
  audit_log: 'Audit_Log',
} as const

function toEntity<TFields extends Record<string, unknown>>(record: AirtableRecord<TFields>) {
  return { ...record.fields, id: record.id, createdTime: record.createdTime } as AirtableEntity<TFields>
}

function escapeFormulaValue(value: string) {
  let escaped = value
  // Prevent formula injection - prefix dangerous characters
  if (/^[=+\-@]/.test(escaped)) {
    escaped = "'" + escaped
  }
  return escaped.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export async function getClients(): Promise<Client[]> {
  const records = await airtableListAll<ClientFields>(TABLES.clients)
  return records.map(toEntity)
}

export async function getClientById(id: string): Promise<Client> {
  const record = await airtableRequestJson<AirtableRecord<ClientFields>>({
    table: TABLES.clients,
    recordId: id,
    method: 'GET',
  })
  return toEntity(record)
}

export async function updateClientStatus(id: string, status: ClientStatus): Promise<Client> {
  const record = await airtableRequestJson<AirtableRecord<ClientFields>>({
    table: TABLES.clients,
    recordId: id,
    method: 'PATCH',
    body: { fields: { status } },
  })
  return toEntity(record)
}

export async function getKeywords(clientId: string): Promise<Keyword[]> {
  const filterByFormula = `{clientId}='${escapeFormulaValue(clientId)}'`
  const records = await airtableListAll<KeywordFields>(TABLES.keywords, { filterByFormula })
  return records.map(toEntity).filter(k => k.clientId === clientId)
}

export async function getContentLibrary(clientId: string): Promise<ContentItem[]> {
  const filterByFormula = `{clientId}='${escapeFormulaValue(clientId)}'`
  const records = await airtableListAll<ContentItemFields>(TABLES.content_library, { filterByFormula })
  return records.map(toEntity).filter(c => c.clientId === clientId)
}

export async function getAuditLog(clientId: string): Promise<AuditLogEntry[]> {
  const filterByFormula = `{clientId}='${escapeFormulaValue(clientId)}'`
  const records = await airtableListAll<AuditLogFields>(TABLES.audit_log, { filterByFormula })
  return records.map(toEntity).filter(a => a.clientId === clientId)
}

// Status Tracking Functions
export async function getStatusTracking(clientId: string): Promise<StatusTracking[]> {
  const filterByFormula = `{clientId}='${escapeFormulaValue(clientId)}'`
  const records = await airtableListAll<StatusTrackingFields>(TABLES.status_tracking, { filterByFormula })
  return records.map(toEntity).filter(s => s.clientId === clientId)
}

export async function getStatusTrackingById(id: string): Promise<StatusTracking> {
  const record = await airtableRequestJson<AirtableRecord<StatusTrackingFields>>({
    table: TABLES.status_tracking,
    recordId: id,
    method: 'GET',
  })
  return toEntity(record)
}

export async function updateStatusTracking(id: string, fields: Partial<StatusTrackingFields>): Promise<StatusTracking> {
  const record = await airtableRequestJson<AirtableRecord<StatusTrackingFields>>({
    table: TABLES.status_tracking,
    recordId: id,
    method: 'PATCH',
    body: { fields },
  })
  return toEntity(record)
}

// Checkpoint Functions
export async function getCheckpoints(clientId: string): Promise<Checkpoint[]> {
  const filterByFormula = `{clientId}='${escapeFormulaValue(clientId)}'`
  const records = await airtableListAll<CheckpointFields>(TABLES.checkpoints, { filterByFormula })
  return records.map(toEntity).filter(c => c.clientId === clientId)
}

export async function getCheckpointById(id: string): Promise<Checkpoint> {
  const record = await airtableRequestJson<AirtableRecord<CheckpointFields>>({
    table: TABLES.checkpoints,
    recordId: id,
    method: 'GET',
  })
  return toEntity(record)
}

export async function updateCheckpoint(id: string, fields: Partial<CheckpointFields>): Promise<Checkpoint> {
  const record = await airtableRequestJson<AirtableRecord<CheckpointFields>>({
    table: TABLES.checkpoints,
    recordId: id,
    method: 'PATCH',
    body: { fields },
  })
  return toEntity(record)
}

// Content Brief Functions
export async function getContentBriefs(clientId: string): Promise<ContentBrief[]> {
  const filterByFormula = `{clientId}='${escapeFormulaValue(clientId)}'`
  const records = await airtableListAll<ContentBriefFields>(TABLES.content_briefs, { filterByFormula })
  return records.map(toEntity).filter(cb => cb.clientId === clientId)
}

export async function getContentBriefById(id: string): Promise<ContentBrief> {
  const record = await airtableRequestJson<AirtableRecord<ContentBriefFields>>({
    table: TABLES.content_briefs,
    recordId: id,
    method: 'GET',
  })
  return toEntity(record)
}

export async function updateContentBrief(id: string, fields: Partial<ContentBriefFields>): Promise<ContentBrief> {
  const record = await airtableRequestJson<AirtableRecord<ContentBriefFields>>({
    table: TABLES.content_briefs,
    recordId: id,
    method: 'PATCH',
    body: { fields },
  })
  return toEntity(record)
}

// Website Build Functions
export async function getWebsiteBuilds(clientId: string): Promise<WebsiteBuild[]> {
  const filterByFormula = `{clientId}='${escapeFormulaValue(clientId)}'`
  const records = await airtableListAll<WebsiteBuildFields>(TABLES.website_builds, { filterByFormula })
  return records.map(toEntity).filter(wb => wb.clientId === clientId)
}

export async function getWebsiteBuildById(id: string): Promise<WebsiteBuild> {
  const record = await airtableRequestJson<AirtableRecord<WebsiteBuildFields>>({
    table: TABLES.website_builds,
    recordId: id,
    method: 'GET',
  })
  return toEntity(record)
}

export async function updateWebsiteBuild(id: string, fields: Partial<WebsiteBuildFields>): Promise<WebsiteBuild> {
  const record = await airtableRequestJson<AirtableRecord<WebsiteBuildFields>>({
    table: TABLES.website_builds,
    recordId: id,
    method: 'PATCH',
    body: { fields },
  })
  return toEntity(record)
}

// GMB Optimization Functions
export async function getGMBOptimizations(clientId: string): Promise<GMBOptimization[]> {
  const filterByFormula = `{clientId}='${escapeFormulaValue(clientId)}'`
  const records = await airtableListAll<GMBOptimizationFields>(TABLES.gmb_optimization, { filterByFormula })
  return records.map(toEntity).filter(gmb => gmb.clientId === clientId)
}

export async function getGMBOptimizationById(id: string): Promise<GMBOptimization> {
  const record = await airtableRequestJson<AirtableRecord<GMBOptimizationFields>>({
    table: TABLES.gmb_optimization,
    recordId: id,
    method: 'GET',
  })
  return toEntity(record)
}

export async function updateGMBOptimization(id: string, fields: Partial<GMBOptimizationFields>): Promise<GMBOptimization> {
  const record = await airtableRequestJson<AirtableRecord<GMBOptimizationFields>>({
    table: TABLES.gmb_optimization,
    recordId: id,
    method: 'PATCH',
    body: { fields },
  })
  return toEntity(record)
}

// Citation Tracking Functions
export async function getCitationTracking(clientId: string): Promise<CitationTracking[]> {
  const filterByFormula = `{clientId}='${escapeFormulaValue(clientId)}'`
  const records = await airtableListAll<CitationTrackingFields>(TABLES.citation_tracking, { filterByFormula })
  return records.map(toEntity).filter(ct => ct.clientId === clientId)
}

export async function getCitationTrackingById(id: string): Promise<CitationTracking> {
  const record = await airtableRequestJson<AirtableRecord<CitationTrackingFields>>({
    table: TABLES.citation_tracking,
    recordId: id,
    method: 'GET',
  })
  return toEntity(record)
}

export async function updateCitationTracking(id: string, fields: Partial<CitationTrackingFields>): Promise<CitationTracking> {
  const record = await airtableRequestJson<AirtableRecord<CitationTrackingFields>>({
    table: TABLES.citation_tracking,
    recordId: id,
    method: 'PATCH',
    body: { fields },
  })
  return toEntity(record)
}
