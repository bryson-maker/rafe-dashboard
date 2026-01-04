/**
 * Airtable Types for RAFE Operations Dashboard
 *
 * These types match the actual Airtable schema used by the RAFE system.
 * All types are derived from the RAFE UI specification and data dictionary.
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Client status through the RAFE pipeline (12 values)
 * Represents the major stages a client moves through
 * IMPORTANT: These values MUST match Airtable exactly for API queries to work
 */
export const ClientStatus = {
  INTAKE_PENDING: 'Intake Pending',
  AWAITING_INTAKE_FORM: 'Awaiting Intake Form',
  READY_FOR_SETUP: 'Ready for Setup',
  PHASE_2_IN_PROGRESS: 'Phase 2 In Progress',
  READY_FOR_WEBSITE_BUILD: 'Ready for Website Build',
  WEBSITE_IN_REVIEW: 'Website In Review',        // CP2
  CONTENT_IN_REVIEW: 'Content In Review',        // CP3
  GMB_IN_PROGRESS: 'GMB In Progress',
  READY_FOR_DELIVERY: 'Ready for Delivery',      // CP4/CP5
  DELIVERED: 'Delivered',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled',
} as const;

export type ClientStatusType = (typeof ClientStatus)[keyof typeof ClientStatus];

/**
 * Checkpoint types (cp1-cp5)
 * Human-in-the-loop review points in the pipeline
 */
export const CheckpointType = {
  CP1: 'cp1',
  CP2: 'cp2',
  CP3: 'cp3',
  CP4: 'cp4',
  CP5: 'cp5',
} as const;

export type CheckpointTypeValue = (typeof CheckpointType)[keyof typeof CheckpointType];

/**
 * Review status for checkpoints
 */
export const ReviewStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CHANGES_REQUESTED: 'changes_requested',
} as const;

export type ReviewStatusType = (typeof ReviewStatus)[keyof typeof ReviewStatus];

/**
 * Overall status indicators for SLA tracking
 */
export const OverallStatus = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OVERDUE: 'overdue',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
} as const;

export type OverallStatusType = (typeof OverallStatus)[keyof typeof OverallStatus];

/**
 * Industry categories for clients
 */
export const Industry = {
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  HVAC: 'hvac',
  ROOFING: 'roofing',
  LANDSCAPING: 'landscaping',
  CLEANING: 'cleaning',
  MOVING: 'moving',
  LEGAL: 'legal',
  DENTAL: 'dental',
  MEDICAL: 'medical',
  AUTOMOTIVE: 'automotive',
  REAL_ESTATE: 'real_estate',
  RESTAURANT: 'restaurant',
  FITNESS: 'fitness',
  BEAUTY: 'beauty',
  OTHER: 'other',
} as const;

export type IndustryType = (typeof Industry)[keyof typeof Industry];

/**
 * Product/Package types offered
 */
export const Product = {
  PRO_WEBSITE: 'pro_website',
  PRO_WEBSITE_SEO: 'pro_website_seo',
  SEO_STARTER: 'seo_starter',
  GMB_OPTIMIZATION: 'gmb_optimization',
  FULL_SERVICE: 'full_service',
  CUSTOM: 'custom',
} as const;

export type ProductType = (typeof Product)[keyof typeof Product];

/**
 * Parallel track identifiers (Phase 2)
 */
export const ParallelTrack = {
  TRACK_A_GHL: 'track_a_ghl',
  TRACK_B_BIRDEYE: 'track_b_birdeye',
  TRACK_C_SEMRUSH: 'track_c_semrush',
  TRACK_D_RESEARCH: 'track_d_research',
} as const;

export type ParallelTrackType = (typeof ParallelTrack)[keyof typeof ParallelTrack];

/**
 * Track status for parallel setup tracks
 */
export const TrackStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type TrackStatusType = (typeof TrackStatus)[keyof typeof TrackStatus];

/**
 * Content types for ContentItem
 */
export const ContentType = {
  BLOG_POST: 'blog_post',
  SOCIAL_POST: 'social_post',
  EMAIL_SEQUENCE: 'email_sequence',
  GMB_POST: 'gmb_post',
} as const;

export type ContentTypeValue = (typeof ContentType)[keyof typeof ContentType];

/**
 * Audit log action types
 */
export const AuditAction = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  DEPLOY: 'deploy',
  TEST: 'test',
  VALIDATE: 'validate',
  GENERATE: 'generate',
  SEND: 'send',
  WEBHOOK: 'webhook',
} as const;

export type AuditActionType = (typeof AuditAction)[keyof typeof AuditAction];

/**
 * Keyword priority levels
 */
export const KeywordPriority = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
} as const;

export type KeywordPriorityType = (typeof KeywordPriority)[keyof typeof KeywordPriority];

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Base interface for all Airtable records
 */
export interface AirtableRecord {
  id: string;
  createdTime: string;
}

// ============================================================================
// CLIENT TYPES
// ============================================================================

/**
 * Main Client record from Airtable
 * This is the master record for each client in the system
 */
export interface Client extends AirtableRecord {
  // Basic Info
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string | null;
  address: string | null;
  city: string;
  state: string;
  zipCode: string | null;

  // Business Details
  industry: IndustryType;
  serviceArea: string | null;
  description: string | null;

  // Package & Payment
  product: ProductType;
  paymentAmount: number;
  paymentDate: string;
  stripePaymentId: string | null;

  // Timeline
  startDate: string;
  targetDeliveryDate: string;
  actualDeliveryDate: string | null;
  dayNumber: number;

  // Status
  status: ClientStatusType;
  overallStatus: OverallStatusType;
  currentPhase: number;

  // Assignment
  assignedSpecialistId: string | null;
  assignedSpecialistName: string | null;

  // External Links
  ghlSubAccountUrl: string | null;
  semrushProjectUrl: string | null;
  birdeyeProfileUrl: string | null;
  googleDriveFolderUrl: string | null;
  stagingUrl: string | null;
  productionUrl: string | null;

  // Discovery Data (linked)
  discoveryId: string | null;
  intakeId: string | null;

  // Progress
  progressPercentage: number;
}

/**
 * Client discovery data - auto-collected information
 */
export interface ClientDiscovery extends AirtableRecord {
  clientId: string;

  // GMB Data
  gmbProfileFound: boolean;
  gmbProfileUrl: string | null;
  gmbClaimed: boolean;
  gmbReviewCount: number | null;
  gmbAverageRating: number | null;

  // Social Profiles
  facebookUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  yelpUrl: string | null;

  // Domain Info
  domainRegistrar: string | null;
  domainExpirationDate: string | null;
  dnsProvider: string | null;

  // Competitor Data
  competitorCount: number;
  competitorUrls: string[];

  // Timestamps
  discoveredAt: string;
}

/**
 * Client intake form responses
 */
export interface ClientIntake extends AirtableRecord {
  clientId: string;

  // Form Responses
  businessDescription: string | null;
  uniqueSellingPoints: string | null;
  targetAudience: string | null;
  servicesOffered: string[];
  preferredColors: string | null;
  brandGuidelines: string | null;
  existingLogoUrl: string | null;
  additionalNotes: string | null;

  // Form Metadata
  formSubmittedAt: string | null;
  formCompletionPercentage: number;
}

// ============================================================================
// STATUS & CHECKPOINT TYPES
// ============================================================================

/**
 * Status tracking for parallel tracks and phases
 */
export interface StatusTracking extends AirtableRecord {
  clientId: string;

  // Track A: GHL Setup
  trackAStatus: TrackStatusType;
  trackASubAccountCreated: boolean;
  trackAPhoneProvisioned: boolean;
  trackAFormsConfigured: boolean;
  trackAAutomationsActive: boolean;
  trackACompletedAt: string | null;

  // Track B: BirdEye
  trackBStatus: TrackStatusType;
  trackBProfileCreated: boolean;
  trackBCitationsSubmitted: number;
  trackBReviewRequestsSent: boolean;
  trackBCompletedAt: string | null;

  // Track C: Semrush
  trackCStatus: TrackStatusType;
  trackCProjectCreated: boolean;
  trackCKeywordsTracked: number;
  trackCSiteAuditScheduled: boolean;
  trackCCompetitorsAdded: number;
  trackCCompletedAt: string | null;

  // Track D: Research
  trackDStatus: TrackStatusType;
  trackDSparkToroComplete: boolean;
  trackDSurferBriefsCount: number;
  trackDContentStrategyComplete: boolean;
  trackDCompletedAt: string | null;

  // Phase Progress
  phase1Complete: boolean;
  phase2Complete: boolean;
  phase3Complete: boolean;
  phase4Complete: boolean;
  phase5Complete: boolean;
  phase6Complete: boolean;

  // Timestamps
  lastUpdated: string;
}

/**
 * Checkpoint record for human-in-the-loop reviews
 */
export interface Checkpoint extends AirtableRecord {
  clientId: string;
  clientName: string;

  // Checkpoint Info
  checkpointType: CheckpointTypeValue;
  checkpointName: string;

  // Status
  status: ReviewStatusType;
  isOverdue: boolean;
  dueDate: string;

  // Review Data
  reviewerId: string | null;
  reviewerName: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  feedbackCategory: string | null;

  // Context Data (varies by checkpoint type)
  contextData: CheckpointContextData;

  // Timestamps
  createdAt: string;
  completedAt: string | null;
}

/**
 * Context data varies by checkpoint type
 */
export type CheckpointContextData =
  | CP1ContextData
  | CP2ContextData
  | CP3ContextData
  | CP4ContextData
  | CP5ContextData;

export interface CP1ContextData {
  type: 'cp1';
  keywordCount: number;
  primaryKeywordCount: number;
  secondaryKeywordCount: number;
  contentStructureReady: boolean;
}

export interface CP2ContextData {
  type: 'cp2';
  stagingUrl: string;
  mobilePageSpeedScore: number;
  desktopPageSpeedScore: number;
  schemaValid: boolean;
  mobileResponsive: boolean;
  sslValid: boolean;
  missingAltTextCount: number;
}

export interface CP3ContextData {
  type: 'cp3';
  blogPostCount: number;
  socialPostCount: number;
  emailSequenceCount: number;
  gmbPostCount: number;
  totalContentItems: number;
}

export interface CP4ContextData {
  type: 'cp4';
  productionUrl: string;
  finalChecksPass: boolean;
  allSystemsVerified: boolean;
}

export interface CP5ContextData {
  type: 'cp5';
  deliveryPackageReady: boolean;
  clientNotified: boolean;
  handoffComplete: boolean;
}

// ============================================================================
// KEYWORD TYPES (DataForSEO/Semrush)
// ============================================================================

/**
 * Keyword data from DataForSEO/Semrush
 */
export interface Keyword extends AirtableRecord {
  clientId: string;

  // Keyword Info
  keyword: string;
  searchVolume: number;
  keywordDifficulty: number;
  cpc: number | null;
  competition: number | null;

  // Classification
  priority: KeywordPriorityType;
  intent: string | null;
  category: string | null;

  // Approval Status
  approved: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;

  // Content Mapping
  targetPage: string | null;
  contentBriefId: string | null;

  // Source
  source: string;
  fetchedAt: string;
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

/**
 * Content brief from SurferSEO
 */
export interface ContentBrief extends AirtableRecord {
  clientId: string;

  // Brief Info
  title: string;
  targetKeyword: string;
  pageType: string;
  wordCountTarget: number;

  // Structure
  h1Suggestion: string;
  h2Suggestions: string[];
  topicClusters: string[];

  // SEO Requirements
  termFrequencies: Record<string, number>;
  competitors: string[];
  surferScore: number | null;

  // Status
  contentGenerated: boolean;
  contentItemId: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Individual content item (blog, social, email, GMB)
 */
export interface ContentItem extends AirtableRecord {
  clientId: string;

  // Content Info
  contentType: ContentTypeValue;
  title: string;
  content: string;
  excerpt: string | null;

  // SEO
  targetKeyword: string | null;
  wordCount: number;
  seoScore: number | null;

  // Status
  status: ReviewStatusType;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionNotes: string | null;

  // Publishing
  publishedAt: string | null;
  publishedUrl: string | null;

  // Brief Link
  contentBriefId: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// WEBSITE BUILD TYPES
// ============================================================================

/**
 * Website build record
 */
export interface WebsiteBuild extends AirtableRecord {
  clientId: string;

  // Build Info
  buildVersion: number;
  generatorModel: string;
  templateUsed: string | null;

  // Files
  htmlContent: string | null;
  cssContent: string | null;
  totalFileSize: number;
  pageCount: number;

  // Validation
  claudeValidationPassed: boolean;
  claudeValidationNotes: string | null;
  schemaMarkupValid: boolean;
  mobileResponsive: boolean;
  metaTagsComplete: boolean;

  // Performance
  mobilePageSpeedScore: number | null;
  desktopPageSpeedScore: number | null;
  fcpMs: number | null;
  lcpMs: number | null;
  clsScore: number | null;
  tbtMs: number | null;
  coreWebVitalsPass: boolean;

  // Deployment
  stagingUrl: string | null;
  stagingDeployedAt: string | null;
  productionUrl: string | null;
  productionDeployedAt: string | null;
  vercelProjectId: string | null;

  // Timestamps
  generatedAt: string;
  lastUpdated: string;
}

// ============================================================================
// GMB OPTIMIZATION TYPES
// ============================================================================

/**
 * GMB optimization tracking
 */
export interface GMBOptimization extends AirtableRecord {
  clientId: string;

  // Profile Status
  profileClaimed: boolean;
  profileOptimized: boolean;
  profileVerified: boolean;

  // Optimization Tasks
  businessInfoUpdated: boolean;
  categoriesOptimized: boolean;
  photosUploaded: number;
  postsCreated: number;
  qaResponded: number;

  // Reviews
  reviewRequestsSent: number;
  newReviewsReceived: number;
  averageRatingBefore: number | null;
  averageRatingAfter: number | null;

  // Citations (BirdEye)
  citationsSubmitted: number;
  citationsLive: number;

  // Timestamps
  optimizationStartedAt: string;
  optimizationCompletedAt: string | null;
  lastUpdated: string;
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

/**
 * Audit log entry for tracking all automated and manual actions
 */
export interface AuditLogEntry extends AirtableRecord {
  clientId: string;
  clientName: string;

  // Action Info
  action: AuditActionType;
  actionDescription: string;
  category: string;

  // Actor
  actorType: 'system' | 'user' | 'automation';
  actorId: string | null;
  actorName: string | null;
  automationWorkflow: string | null;

  // Data
  inputSummary: string | null;
  outputSummary: string | null;
  metadata: Record<string, unknown>;

  // Status
  success: boolean;
  errorMessage: string | null;

  // Timestamps
  timestamp: string;
  durationMs: number | null;
}

// ============================================================================
// TEAM MEMBER TYPES
// ============================================================================

/**
 * Team member / operator record
 */
export interface TeamMember extends AirtableRecord {
  name: string;
  email: string;
  role: 'owner' | 'operator' | 'admin';
  isActive: boolean;

  // Stats
  activeClientCount: number;
  pendingCheckpointCount: number;
  completedThisWeek: number;
  averageDeliveryDays: number | null;

  // Preferences
  notificationPreferences: NotificationPreferences;

  // Timestamps
  lastLoginAt: string | null;
}

export interface NotificationPreferences {
  emailDigest: boolean;
  browserNotifications: boolean;
  overdueAlerts: boolean;
  newCheckpointAlerts: boolean;
}

// ============================================================================
// INTEGRATION TYPES
// ============================================================================

/**
 * Integration health status
 */
export interface IntegrationHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  lastCheckedAt: string;
  errorMessage: string | null;
}

// ============================================================================
// QUERY/FILTER TYPES
// ============================================================================

/**
 * Filter options for client queries
 */
export interface ClientFilters {
  status?: ClientStatusType[];
  overallStatus?: OverallStatusType[];
  assignedSpecialistId?: string;
  industry?: IndustryType[];
  product?: ProductType[];
  isOverdue?: boolean;
  hasPendingCheckpoint?: boolean;
  searchQuery?: string;
}

/**
 * Sort options for client queries
 */
export interface ClientSortOptions {
  field: 'businessName' | 'dayNumber' | 'dueDate' | 'status' | 'createdTime';
  direction: 'asc' | 'desc';
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
  offset?: string; // Airtable offset for cursor-based pagination
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  records: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  offset?: string;
}
