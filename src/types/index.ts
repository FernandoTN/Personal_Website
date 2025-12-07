// Type definitions for the personal website

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'

export type PostCategory =
  | 'ANCHOR'
  | 'THEME'
  | 'EMERGENT'
  | 'PRACTITIONER'
  | 'PROTOTYPE'
  | 'CONFERENCE'
  | 'METHODOLOGY'

export type CommentStatus = 'PENDING' | 'APPROVED' | 'SPAM'

export type SubscriberStatus = 'ACTIVE' | 'UNSUBSCRIBED'

export type LinkedInStatus = 'PENDING' | 'MANUALLY_SCHEDULED' | 'POSTED'

export type ContactSubmissionStatus = 'NEW' | 'READ' | 'REPLIED'

export type ProjectCategory = 'pharma' | 'coding' | 'research'

export type TimelineEventType = 'education' | 'work' | 'achievement'

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Post types
export interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  featuredImage?: string
  ogImage?: string
  status: PostStatus
  publishedAt?: Date
  scheduledFor?: Date
  seriesId?: string
  seriesOrder?: number
  category?: PostCategory
  author: string
  metaTitle?: string
  metaDescription?: string
  viewCount: number
  readingTimeMinutes?: number
  createdAt: Date
  updatedAt: Date
  tags?: Tag[]
  series?: Series
}

export interface PostPreview {
  id: string
  slug: string
  title: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: Date
  category?: PostCategory
  readingTimeMinutes?: number
  author: string
  tags?: Tag[]
}

// Series types
export interface Series {
  id: string
  slug: string
  name: string
  description?: string
  coverImage?: string
  color?: string
  postCount: number
  isFeatured: boolean
  startDate?: Date
  endDate?: Date
}

// Tag types
export interface Tag {
  id: string
  slug: string
  name: string
  postCount: number
}

// Project types
export interface Project {
  id: string
  slug: string
  title: string
  description?: string
  content?: string
  featuredImage?: string
  gallery?: string[]
  category?: string
  techStack?: string[]
  liveUrl?: string
  repoUrl?: string
  isFeatured: boolean
  displayOrder: number
}

// Comment types
export interface Comment {
  id: string
  postId: string
  parentId?: string
  authorName: string
  authorEmail: string
  content: string
  status: CommentStatus
  createdAt: Date
  replies?: Comment[]
}

// Subscriber types
export interface Subscriber {
  id: string
  email: string
  name?: string
  status: SubscriberStatus
  subscribedAt: Date
  unsubscribedAt?: Date
  source?: string
}

// Contact types
export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: ContactSubmissionStatus
  createdAt: Date
}

// Timeline types
export interface TimelineEvent {
  id: string
  title: string
  description?: string
  date: Date
  endDate?: Date
  type: TimelineEventType
  company?: string
  location?: string
  icon?: string
  color?: string
  displayOrder: number
}

// LinkedIn types
export interface LinkedInPost {
  id: string
  postId: string
  content: string
  hashtags?: string[]
  scheduledDate?: Date
  scheduledTime?: string
  imageFile?: string
  status: LinkedInStatus
  manuallyScheduled: boolean
  linkedinPostUrl?: string
  postedAt?: Date
}

// Analytics types
export interface PageViewStats {
  path: string
  views: number
  uniqueVisitors: number
}

export interface TrafficOverview {
  totalViews: number
  totalVisitors: number
  viewsByDay: { date: string; views: number }[]
  topPages: PageViewStats[]
  topReferrers: { referrer: string; count: number }[]
}

// Form types
export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

export interface SubscribeFormData {
  email: string
  name?: string
  source?: string
}

export interface CommentFormData {
  postId: string
  parentId?: string
  authorName: string
  authorEmail: string
  content: string
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  external?: boolean
}

// MDX Component props
export interface CalloutProps {
  type: 'info' | 'warning' | 'success' | 'error'
  title?: string
  children: React.ReactNode
}

export interface QuoteProps {
  author?: string
  source?: string
  children: React.ReactNode
}

export interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}
