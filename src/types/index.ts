/**
 * RAFE Operations Dashboard - Type Exports
 *
 * This file re-exports all types from the types directory for convenient imports.
 *
 * Usage:
 *   import { Client, ClientStatus, STATUS_COLORS } from '@/types';
 *   import type { ClientCard, CheckpointReviewView } from '@/types';
 */

// ============================================================================
// AIRTABLE TYPES
// ============================================================================

// Enums / Const Objects
export {
  AuditAction,
  CheckpointType,
  ClientStatus,
  ContentType,
  Industry,
  KeywordPriority,
  OverallStatus,
  ParallelTrack,
  Product,
  ReviewStatus,
  TrackStatus,
} from './airtable';

// Enum Types
export type {
  AuditActionType,
  CheckpointTypeValue,
  ClientStatusType,
  ContentTypeValue,
  IndustryType,
  KeywordPriorityType,
  OverallStatusType,
  ParallelTrackType,
  ProductType,
  ReviewStatusType,
  TrackStatusType,
} from './airtable';

// Base Types
export type { AirtableRecord } from './airtable';

// Client Types
export type { Client, ClientDiscovery, ClientIntake } from './airtable';

// Status & Checkpoint Types
export type {
  Checkpoint,
  CheckpointContextData,
  CP1ContextData,
  CP2ContextData,
  CP3ContextData,
  CP4ContextData,
  CP5ContextData,
  StatusTracking,
} from './airtable';

// Keyword Types
export type { Keyword } from './airtable';

// Content Types
export type { ContentBrief, ContentItem } from './airtable';

// Website Build Types
export type { WebsiteBuild } from './airtable';

// GMB Types
export type { GMBOptimization } from './airtable';

// Audit Log Types
export type { AuditLogEntry } from './airtable';

// Team Member Types
export type { NotificationPreferences, TeamMember } from './airtable';

// Integration Types
export type { IntegrationHealth } from './airtable';

// Query/Filter Types
export type {
  ClientFilters,
  ClientSortOptions,
  PaginatedResponse,
  PaginationOptions,
} from './airtable';

// ============================================================================
// UI TYPES
// ============================================================================

// Helper Constants
export {
  CHECKPOINT_COLUMNS,
  KEYBOARD_SHORTCUTS,
  PIPELINE_COLUMNS,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_TO_COLUMN,
} from './ui';

// UI State Types
export type { PanelState, TimeRange, UrgencyLevel, ViewMode } from './ui';

// Card/List Item Types
export type { ActivityFeedItem, ClientCard, TaskQueueItem } from './ui';

// Metrics/Dashboard Types
export type {
  CapacityMetrics,
  CheckpointPerformanceMetrics,
  DeliveryTimelineEntry,
  PipelineMetrics,
  TeamWorkloadSummary,
  WeeklyMetrics,
} from './ui';

// Form/Input Types
export type {
  CheckpointReviewForm,
  ClientFilterForm,
  SortConfig,
} from './ui';

// Modal/Dialog Types
export type { ConfirmationDialogProps, ToastNotification } from './ui';

// Composite View Types
export type {
  CheckpointReviewView,
  ClientDetailView,
  OperatorWorkstationView,
  OwnerDashboardView,
} from './ui';

// Navigation/Routing Types
export type { BreadcrumbItem, NavigationItem } from './ui';

// Keyboard Shortcut Types
export type { KeyboardShortcut } from './ui';

// Theme Types
export type { SpacingScale, ThemeColors, TypographyScale } from './ui';
