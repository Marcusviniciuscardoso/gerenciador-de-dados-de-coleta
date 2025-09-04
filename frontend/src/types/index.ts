export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  collectionsCount: number
  samplesCount: number
}

export interface Collection {
  id: string
  projectId: string
  species: string
  location: string
  date: string
  time: string
  responsible: string
  notes: string
  createdAt: string
  updatedAt: string
  samplesCount: number
  images: Image[]
}

export interface Sample {
  id: string
  collectionId: string
  description: string
  identificationCode: string
  container: string
  state: "fresh" | "preserved" | "dried" | "frozen"
  observations: string
  createdAt: string
  updatedAt: string
  images: Image[]
}

export interface Image {
  id: string
  url: string
  filename: string
  description?: string
  uploadedAt: string
  entityType: "project" | "collection" | "sample"
  entityId: string
}
