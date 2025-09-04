export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "researcher" | "student" | "professor" | "technician"
  institution: string
  status: "active" | "inactive" | "pending"
  createdAt: string
  lastLogin?: string
  projectsCount: number
  collectionsCount: number
}

export interface CreateUserData {
  name: string
  email: string
  role: "admin" | "researcher" | "student" | "professor" | "technician"
  institution: string
  password: string
  sendWelcomeEmail: boolean
}
