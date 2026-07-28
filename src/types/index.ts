export type JobStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Published'
  | 'Paused'
  | 'Expired'
  | 'Closed'
  | 'Filled'

export type ChannelCategory =
  | 'Social Media'
  | 'Job Board'
  | 'Company Website'
  | 'Employee Referral'
  | 'Other'

export type UserRole =
  | 'Admin'
  | 'HR Manager'
  | 'HR Recruiter'
  | 'TA Lead'
  | 'Hiring Manager'

export interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  status: JobStatus
  description: string
  experience?: string
  skills?: string
  english?: string
  education?: string
  note?: string
  recruiterId: string
  recruiterName: string
  applicantsCount: number
  createdDate: string
  updatedDate: string
  expiryDate?: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  publishedChannels: string[] // Channel IDs
  timelineEvents?: RecruitmentTimelineEvent[]
}

export interface RecruitmentChannel {
  id: string
  name: string
  category: ChannelCategory
  activeJobsCount: number
  totalCandidates: number
  trend: string
  status: 'Active' | 'Inactive'
}

export interface JobChannelPublishTrack {
  jobId: string
  channelId: string
  status: 'Draft' | 'Published' | 'Pending' | 'Expired'
  publishedDate?: string
  postUrl?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  avatar?: string
}

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  details: string
}

export interface EmailLog {
  id: string
  jobId?: string
  jobTitle?: string
  sender: string
  recipient: string
  recipientEmail: string
  topic: string
  content: string
  time: string
  status: 'Sent' | 'Delivered' | 'Replied'
}

export interface RecruitmentTimelineEvent {
  id: string
  jobId: string
  date: string
  action: string
  actor: string
  note?: string
}
