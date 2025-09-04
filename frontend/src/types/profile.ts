export interface UserProfile {
  id: string
  name: string
  email: string
  role: "admin" | "professor" | "researcher" | "student" | "technician"
  institution: string
  phone?: string
  bio?: string
  avatar_url?: string
  status: "active" | "inactive" | "pending"
  specializations: string[]
  orcid?: string
  researchGate?: string
  linkedin?: string
  website?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  preferences: {
    language: string
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
    publicProfile: boolean
  }
  createdAt: string
  lastLoginAt?: string
  projectsCount: number
  collectionsCount: number
  samplesCount: number
  collaborationsCount: number
}

export interface ActivityItem {
  id: string
  type: "project_created" | "collection_added" | "sample_registered" | "collaboration_joined"
  title: string
  description: string
  entityId: string
  entityType: "project" | "collection" | "sample"
  timestamp: string
}
