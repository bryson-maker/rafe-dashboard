/**
 * UI-Specific Types for RAFE Operations Dashboard
 *
 * These types are used for UI state, components, and display logic.
 * They complement the Airtable types with view-specific concerns.
 */

import type {
  AuditLogEntry,
  Checkpoint,
  CheckpointTypeValue,
  Client,
  ClientStatusType,
  ContentItem,
  Keyword,
  OverallStatusType,
  StatusTracking,
  TeamMember,
  WebsiteBuild,
} from './airtable';

// ============================================================================
// HELPER CONSTANTS
// ============================================================================

/**
 * Status colors for visual indicators
 */
export const STATUS_COLORS = {
  // Overall Status Colors
  on_track: '#10B981', // green-500
  at_risk: '#F59E0B', // amber-500
  overdue: '#EF4444', // red-500
  completed: '#10B981', // green-500
  blocked: '#6B7280', // gray-500

  // Review Status Colors
  pending: '#F59E0B', // amber-500
  approved: '#10B981', // green-500
  rejected: '#EF4444', // red-500
  changes_requested: '#F97316', // orange-500

  // Generic Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  neutral: '#6B7280',

  // Checkpoint Column Background
  checkpoint: '#8B5CF6', // purple-500
} as const;

/**
 * Mapping of client status to Kanban column
 * Maps Airtable status values to UI column IDs
 */
export const STATUS_TO_COLUMN = {
  'Intake Pending': 'intake',
  'Awaiting Intake Form': 'intake',
  'Ready for Setup': 'setup',
  'Phase 2 In Progress': 'setup',
  'Ready for Website Build': 'build',
  'Website In Review': 'cp2',         // CP2
  'Content In Review': 'cp3',         // CP3
  'GMB In Progress': 'gmb',
  'Ready for Delivery': 'final',      // CP4/CP5
  'Delivered': 'done',
  'On Hold': 'on_hold',
  'Cancelled': 'cancelled',
} as const;

/**
 * Human-friendly status labels for UI display
 * Maps technical Airtable status values to readable labels
 */
export const STATUS_LABELS = {
  'Intake Pending': 'Intake Pending',
  'Awaiting Intake Form': 'Awaiting Form',
  'Ready for Setup': 'Ready for Setup',
  'Phase 2 In Progress': 'Phase 2',
  'Ready for Website Build': 'Ready for Build',
  'Website In Review': 'CP2 Review',
  'Content In Review': 'CP3 Review',
  'GMB In Progress': 'GMB Setup',
  'Ready for Delivery': 'Ready to Deliver',
  'Delivered': 'Delivered',
  'On Hold': 'On Hold',
  'Cancelled': 'Cancelled',
} as const;
/**
 * Pipeline columns configuration for Kanban board
 */
export const PIPELINE_COLUMNS = [
  {
    id: 'intake',
    title: 'Intake',
    statuses: ['Intake Pending', 'Awaiting Intake Form'] as ClientStatusType[],
    isCheckpoint: false,
    color: null,
  },
  {
    id: 'setup',
    title: 'Setup',
    statuses: ['Ready for Setup', 'Phase 2 In Progress'] as ClientStatusType[],
    isCheckpoint: false,
    color: null,
  },
  {
    id: 'cp1',
    title: 'CP1',
    statuses: [] as ClientStatusType[],  // CP1 doesn't have a specific status in Data Dictionary
    isCheckpoint: true,
    color: STATUS_COLORS.checkpoint,
  },
  {
    id: 'build',
    title: 'Build',
    statuses: ['Ready for Website Build'] as ClientStatusType[],
    isCheckpoint: false,
    color: null,
  },
  {
    id: 'cp2',
    title: 'CP2',
    statuses: ['Website In Review'] as ClientStatusType[],
    isCheckpoint: true,
    color: STATUS_COLORS.checkpoint,
  },
  {
    id: 'content',
    title: 'Content',
    statuses: [] as ClientStatusType[],  // Between CP2 and CP3, no specific status
    isCheckpoint: false,
    color: null,
  },
  {
    id: 'cp3',
    title: 'CP3',
    statuses: ['Content In Review'] as ClientStatusType[],
    isCheckpoint: true,
    color: STATUS_COLORS.checkpoint,
  },
  {
    id: 'gmb',
    title: 'GMB',
    statuses: ['GMB In Progress'] as ClientStatusType[],
    isCheckpoint: false,
    color: null,
  },
  {
    id: 'final',
    title: 'Final',
    statuses: ['Ready for Delivery'] as ClientStatusType[],
    isCheckpoint: true,
    color: STATUS_COLORS.checkpoint,
  },
  {
    id: 'done',
    title: 'Done',
    statuses: ['Delivered'] as ClientStatusType[],
    isCheckpoint: false,
    color: STATUS_COLORS.success,
  },
] as const;

/**
 * Checkpoint columns configuration
 */
export const CHECKPOINT_COLUMNS = {
  cp1: {
    id: 'cp1',
    name: 'Keywords & Structure',
    description: 'Review selected keywords and content structure',
    phase: 2,
  },
  cp2: {
    id: 'cp2',
    name: 'Staging Website',
    description: 'Review staging website before content creation',
    phase: 3,
  },
  cp3: {
    id: 'cp3',
    name: 'Content Review',
    description: 'Review generated content (blog, social, email)',
    phase: 4,
  },
  cp4: {
    id: 'cp4',
    name: 'Production Ready',
    description: 'Final QA and production deployment check',
    phase: 6,
  },
  cp5: {
    id: 'cp5',
    name: 'Client Delivery',
    description: 'Client handoff and delivery confirmation',
    phase: 6,
  },
} as const;

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Urgency level for visual indicators
 */
export type UrgencyLevel = 'overdue' | 'due_soon' | 'on_track' | 'not_started';

/**
 * Time range for filters and analytics
 */
export type TimeRange = 'today' | 'this_week' | 'this_month' | 'last_30_days' | 'custom';

/**
 * View mode for different UI layouts
 */
export type ViewMode = 'kanban' | 'list' | 'timeline';

/**
 * Panel state for slide-out panels
 */
export interface PanelState {
  isOpen: boolean;
  panelType: 'client_detail' | 'checkpoint_review' | 'settings' | null;
  entityId: string | null;
}

// ============================================================================
// CARD/LIST ITEM TYPES
// ============================================================================

/**
 * Client card data for Kanban/list views
 */
export interface ClientCard {
  id: string;
  businessName: string;
  ownerName: string;
  dayNumber: number;
  targetDeliveryDays: number;
  status: ClientStatusType;
  overallStatus: OverallStatusType;
  progressPercentage: number;
  assignedSpecialistName: string | null;
  urgency: UrgencyLevel;
  hasPendingCheckpoint: boolean;
  pendingCheckpointType: CheckpointTypeValue | null;
  city: string;
  industry: string;
}

/**
 * Task queue item for operator workstation
 */
export interface TaskQueueItem {
  id: string;
  checkpointId: string;
  clientId: string;
  clientName: string;
  checkpointType: CheckpointTypeValue;
  checkpointName: string;
  dueDate: string;
  isOverdue: boolean;
  hoursUntilDue: number;
  urgency: UrgencyLevel;
  assignedSpecialistId: string | null;
}

/**
 * Activity feed item
 */
export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  clientId: string;
  clientName: string;
  action: string;
  description: string;
  actorName: string | null;
  actorType: 'system' | 'user' | 'automation';
  category: string;
}

// ============================================================================
// METRICS/DASHBOARD TYPES
// ============================================================================

/**
 * Pipeline overview metrics
 */
export interface PipelineMetrics {
  totalActive: number;
  onTrackPercentage: number;
  averageDeliveryDays: number;
  targetDeliveryDays: number;
  byColumn: Record<string, number>;
}

/**
 * Weekly performance metrics
 */
export interface WeeklyMetrics {
  started: number;
  delivered: number;
  inProgress: number;
  slaCompliance: number;
}

/**
 * Team workload summary
 */
export interface TeamWorkloadSummary {
  memberId: string;
  memberName: string;
  activeClients: number;
  pendingCheckpoints: number;
  completedThisWeek: number;
  averageDeliveryDays: number | null;
  workloadPercentage: number;
}

/**
 * Capacity metrics
 */
export interface CapacityMetrics {
  activeClients: number;
  maxCapacity: number;
  availableSlots: number;
  utilizationPercentage: number;
  recommendation: string;
}

/**
 * Delivery timeline entry
 */
export interface DeliveryTimelineEntry {
  date: string;
  dayOfWeek: string;
  expectedDeliveries: number;
  actualDeliveries: number;
  isToday: boolean;
  isPast: boolean;
}

/**
 * Checkpoint performance metrics
 */
export interface CheckpointPerformanceMetrics {
  checkpointType: CheckpointTypeValue;
  averageReviewTimeHours: number;
  approvalRate: number;
  totalReviewed: number;
  averageIterations: number;
}

// ============================================================================
// FORM/INPUT TYPES
// ============================================================================

/**
 * Checkpoint review form data
 */
export interface CheckpointReviewForm {
  decision: 'approve' | 'request_changes';
  notes: string;
  feedbackCategory: string | null;
  specificIssues: string[];
}

/**
 * Client filter form
 */
export interface ClientFilterForm {
  searchQuery: string;
  statuses: ClientStatusType[];
  overallStatuses: OverallStatusType[];
  assignedSpecialistId: string | null;
  isOverdue: boolean | null;
  hasPendingCheckpoint: boolean | null;
  industries: string[];
  products: string[];
}

/**
 * Sort configuration
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// ============================================================================
// MODAL/DIALOG TYPES
// ============================================================================

/**
 * Confirmation dialog props
 */
export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Toast notification
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string | null;
  duration: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// COMPOSITE VIEW TYPES
// ============================================================================

/**
 * Client detail view data - aggregated from multiple tables
 */
export interface ClientDetailView {
  client: Client;
  statusTracking: StatusTracking | null;
  checkpoints: Checkpoint[];
  keywords: Keyword[];
  contentItems: ContentItem[];
  websiteBuild: WebsiteBuild | null;
  auditLog: AuditLogEntry[];
  assignedSpecialist: TeamMember | null;
}

/**
 * Checkpoint review view data
 */
export interface CheckpointReviewView {
  checkpoint: Checkpoint;
  client: Client;
  previousCheckpoints: Checkpoint[];

  // Context data varies by checkpoint type
  keywords?: Keyword[];
  websiteBuild?: WebsiteBuild;
  contentItems?: ContentItem[];
}

/**
 * Owner dashboard view data
 */
export interface OwnerDashboardView {
  pipelineMetrics: PipelineMetrics;
  weeklyMetrics: WeeklyMetrics;
  capacityMetrics: CapacityMetrics;
  teamWorkload: TeamWorkloadSummary[];
  deliveryTimeline: DeliveryTimelineEntry[];
  clientCards: ClientCard[];
  pendingCheckpoints: TaskQueueItem[];
}

/**
 * Operator workstation view data
 */
export interface OperatorWorkstationView {
  taskQueue: TaskQueueItem[];
  completedToday: TaskQueueItem[];
  currentTask: CheckpointReviewView | null;
  clientContext: ClientDetailView | null;
}

// ============================================================================
// NAVIGATION/ROUTING TYPES
// ============================================================================

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href: string | null;
  isCurrent: boolean;
}

/**
 * Navigation item for sidebar
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  isActive?: boolean;
  children?: NavigationItem[];
}

// ============================================================================
// KEYBOARD SHORTCUT TYPES
// ============================================================================

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  key: string;
  modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  description: string;
  action: string;
  scope: 'global' | 'review' | 'list';
}

/**
 * Default keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'k',
    modifiers: ['ctrl'],
    description: 'Global search',
    action: 'openSearch',
    scope: 'global',
  },
  {
    key: 'a',
    modifiers: [],
    description: 'Approve current review',
    action: 'approve',
    scope: 'review',
  },
  {
    key: 'r',
    modifiers: [],
    description: 'Request changes',
    action: 'requestChanges',
    scope: 'review',
  },
  {
    key: 's',
    modifiers: [],
    description: 'Skip for now',
    action: 'skip',
    scope: 'review',
  },
  {
    key: 'n',
    modifiers: [],
    description: 'Next task',
    action: 'nextTask',
    scope: 'review',
  },
  {
    key: 'p',
    modifiers: [],
    description: 'Previous task',
    action: 'prevTask',
    scope: 'review',
  },
  {
    key: 'Escape',
    modifiers: [],
    description: 'Close panel/modal',
    action: 'close',
    scope: 'global',
  },
  {
    key: '/',
    modifiers: [],
    description: 'Focus search',
    action: 'focusSearch',
    scope: 'global',
  },
  {
    key: '1',
    modifiers: [],
    description: 'Filter to CP1',
    action: 'filterCp1',
    scope: 'list',
  },
  {
    key: '2',
    modifiers: [],
    description: 'Filter to CP2',
    action: 'filterCp2',
    scope: 'list',
  },
  {
    key: '3',
    modifiers: [],
    description: 'Filter to CP3',
    action: 'filterCp3',
    scope: 'list',
  },
  {
    key: '4',
    modifiers: [],
    description: 'Filter to CP4',
    action: 'filterCp4',
    scope: 'list',
  },
  {
    key: '5',
    modifiers: [],
    description: 'Filter to CP5',
    action: 'filterCp5',
    scope: 'list',
  },
] as const;

// ============================================================================
// THEME TYPES
// ============================================================================

/**
 * Theme color tokens
 */
export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

/**
 * Typography scale
 */
export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

/**
 * Spacing scale
 */
export interface SpacingScale {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
}
