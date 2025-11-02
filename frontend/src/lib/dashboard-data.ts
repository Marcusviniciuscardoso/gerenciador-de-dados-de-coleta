import { mockUsers } from "./mock-users"
import { mockProjects, mockCollections, mockSamples } from "./mock-data"

// Dados expandidos para o dashboard
export interface DashboardStats {
  overview: {
    totalUsers: number
    activeUsers: number
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalCollections: number
    totalSamples: number
    lastActivity: {
      type: string
      description: string
      user: string
      timestamp: string
    }
  }
  projects: {
    byStatus: Array<{ status: string; count: number; color: string }>
    byInstitution: Array<{ institution: string; count: number }>
    byFunding: Array<{ source: string; count: number; amount: number }>
    topKeywords: Array<{ keyword: string; count: number }>
    timeline: Array<{ month: string; created: number; completed: number }>
  }
  collections: {
    byLocation: Array<{
      id: string
      location: string
      coordinates: { lat: number; lng: number }
      count: number
      species: string[]
    }>
    byUser: Array<{ user: string; count: number; avatar?: string }>
    averageDuration: number
    timeline: Array<{ date: string; count: number }>
    byWeather: Array<{ condition: string; count: number }>
  }
  samples: {
    byType: Array<{ type: string; count: number; color: string }>
    byPreservation: Array<{ method: string; count: number }>
    byProject: Array<{ project: string; count: number }>
    expiringCount: number
    expiringSoon: Array<{
      id: string
      code: string
      description: string
      expiryDate: string
      daysLeft: number
    }>
    byStatus: Array<{ status: string; count: number }>
  }
  images: {
    total: number
    recent: Array<{
      id: string
      url: string
      filename: string
      entityType: string
      uploadedBy: string
      uploadedAt: string
    }>
    byType: Array<{ type: string; count: number }>
    byMonth: Array<{ month: string; count: number }>
  }
  audit: {
    recentActions: Array<{
      id: string
      action: string
      user: string
      entity: string
      timestamp: string
      details: string
      severity: "low" | "medium" | "high"
    }>
    actionFrequency: Array<{ action: string; count: number }>
    userActivity: Array<{ user: string; actions: number }>
    timeline: Array<{ hour: string; count: number }>
  }
}

// Função para gerar dados mock do dashboard
export function generateDashboardData(): DashboardStats {
  const now = new Date()
  const activeUsers = mockUsers.filter((u) => u.status === "active")
  const activeProjects = mockProjects.filter((p) => p.name.includes("ativo") || Math.random() > 0.3)
  const completedProjects = mockProjects.length - activeProjects.length

  return {
    overview: {
      totalUsers: mockUsers.length,
      activeUsers: activeUsers.length,
      totalProjects: mockProjects.length,
      activeProjects: activeProjects.length,
      completedProjects,
      totalCollections: mockCollections.length,
      totalSamples: mockSamples.length,
      lastActivity: {
        type: "collection",
        description: "Nova coleta registrada: Cecropia pachystachya",
        user: "Dr. Maria Silva",
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
    },
    projects: {
      byStatus: [
        { status: "Ativo", count: activeProjects.length, color: "#10b981" },
        { status: "Concluído", count: completedProjects, color: "#6366f1" },
        { status: "Pausado", count: 1, color: "#f59e0b" },
        { status: "Cancelado", count: 0, color: "#ef4444" },
      ],
      byInstitution: [
        { institution: "Universidade Federal do Brasil", count: 2 },
        { institution: "Instituto de Pesquisas Biológicas", count: 1 },
        { institution: "Universidade Estadual", count: 1 },
        { institution: "Centro de Pesquisas Ambientais", count: 1 },
      ],
      byFunding: [
        { source: "CNPq", count: 2, amount: 150000 },
        { source: "FAPESP", count: 1, amount: 80000 },
        { source: "CAPES", count: 1, amount: 60000 },
        { source: "Recursos Próprios", count: 1, amount: 25000 },
      ],
      topKeywords: [
        { keyword: "Biodiversidade", count: 3 },
        { keyword: "Mata Atlântica", count: 2 },
        { keyword: "Taxonomia", count: 2 },
        { keyword: "Conservação", count: 2 },
        { keyword: "Ecologia", count: 1 },
      ],
      timeline: [
        { month: "Jan", created: 1, completed: 0 },
        { month: "Fev", created: 2, completed: 1 },
        { month: "Mar", created: 0, completed: 0 },
        { month: "Abr", created: 1, completed: 0 },
        { month: "Mai", created: 0, completed: 1 },
      ],
    },
    collections: {
      byLocation: [
        {
          id: "1",
          location: "Parque Nacional da Serra dos Órgãos",
          coordinates: { lat: -22.4567, lng: -43.1234 },
          count: 5,
          species: ["Cecropia pachystachya", "Morpho menelaus"],
        },
        {
          id: "2",
          location: "Reserva da Biosfera da Mata Atlântica",
          coordinates: { lat: -22.5678, lng: -43.2345 },
          count: 3,
          species: ["Euterpe edulis"],
        },
        {
          id: "3",
          location: "Pantanal Sul-Mato-Grossense",
          coordinates: { lat: -19.1234, lng: -57.5678 },
          count: 8,
          species: ["Hyacinth Macaw", "Caiman yacare"],
        },
      ],
      byUser: [
        { user: "Dr. Maria Silva", count: 8, avatar: "/placeholder.svg?height=32&width=32" },
        { user: "Prof. João Santos", count: 5, avatar: "/placeholder.svg?height=32&width=32" },
        { user: "Ana Costa", count: 3, avatar: "/placeholder.svg?height=32&width=32" },
        { user: "Carlos Oliveira", count: 1, avatar: "/placeholder.svg?height=32&width=32" },
      ],
      averageDuration: 4.5,
      timeline: [
        { date: "2024-01-15", count: 2 },
        { date: "2024-01-16", count: 1 },
        { date: "2024-01-17", count: 3 },
        { date: "2024-01-18", count: 1 },
        { date: "2024-01-19", count: 2 },
        { date: "2024-01-20", count: 4 },
        { date: "2024-01-21", count: 3 },
      ],
      byWeather: [
        { condition: "Ensolarado", count: 8 },
        { condition: "Nublado", count: 5 },
        { condition: "Chuvoso", count: 2 },
        { condition: "Neblina", count: 1 },
      ],
    },
    samples: {
      byType: [
        { type: "Tecido", count: 15, color: "#10b981" },
        { type: "Folha", count: 12, color: "#22c55e" },
        { type: "Semente", count: 8, color: "#84cc16" },
        { type: "Solo", count: 6, color: "#a3a3a3" },
        { type: "Água", count: 4, color: "#3b82f6" },
        { type: "Sangue", count: 3, color: "#ef4444" },
      ],
      byPreservation: [
        { method: "Congelado", count: 20 },
        { method: "Seco", count: 15 },
        { method: "Álcool", count: 8 },
        { method: "Fresco", count: 5 },
      ],
      byProject: [
        { project: "Biodiversidade da Mata Atlântica", count: 25 },
        { project: "Fauna Aquática do Pantanal", count: 15 },
        { project: "Flora do Cerrado", count: 8 },
      ],
      expiringCount: 5,
      expiringSoon: [
        {
          id: "1",
          code: "CP-001-F1",
          description: "Folha jovem da copa",
          expiryDate: "2024-02-15",
          daysLeft: 10,
        },
        {
          id: "2",
          code: "MM-002-S1",
          description: "Amostra de sangue",
          expiryDate: "2024-02-20",
          daysLeft: 15,
        },
      ],
      byStatus: [
        { status: "Armazenada", count: 35 },
        { status: "Processando", count: 8 },
        { status: "Analisada", count: 5 },
      ],
    },
    images: {
      total: 127,
      recent: [
        {
          id: "1",
          url: "/placeholder.svg?height=100&width=100",
          filename: "coleta_campo_001.jpg",
          entityType: "collection",
          uploadedBy: "Dr. Maria Silva",
          uploadedAt: "2024-01-22T10:30:00Z",
        },
        {
          id: "2",
          url: "/placeholder.svg?height=100&width=100",
          filename: "amostra_microscopio.jpg",
          entityType: "sample",
          uploadedBy: "Ana Costa",
          uploadedAt: "2024-01-22T09:15:00Z",
        },
      ],
      byType: [
        { type: "Coleta", count: 45 },
        { type: "Amostra", count: 38 },
        { type: "Projeto", count: 25 },
        { type: "Equipamento", count: 19 },
      ],
      byMonth: [
        { month: "Jan", count: 45 },
        { month: "Fev", count: 32 },
        { month: "Mar", count: 28 },
        { month: "Abr", count: 22 },
      ],
    },
    audit: {
      recentActions: [
        {
          id: "1",
          action: "CREATE",
          user: "Dr. Maria Silva",
          entity: "Amostra CP-001-F1",
          timestamp: "2024-01-22T10:30:00Z",
          details: "Nova amostra registrada",
          severity: "low",
        },
        {
          id: "2",
          action: "UPDATE",
          user: "Ana Costa",
          entity: "Projeto Biodiversidade",
          timestamp: "2024-01-22T09:15:00Z",
          details: "Status atualizado para ativo",
          severity: "medium",
        },
        {
          id: "3",
          action: "DELETE",
          user: "Admin",
          entity: "Usuário teste",
          timestamp: "2024-01-21T16:45:00Z",
          details: "Conta de teste removida",
          severity: "high",
        },
      ],
      actionFrequency: [
        { action: "CREATE", count: 45 },
        { action: "UPDATE", count: 32 },
        { action: "READ", count: 156 },
        { action: "DELETE", count: 8 },
      ],
      userActivity: [
        { user: "Dr. Maria Silva", actions: 67 },
        { user: "Ana Costa", actions: 45 },
        { user: "Prof. João Santos", actions: 38 },
        { user: "Admin", actions: 23 },
      ],
      timeline: [
        { hour: "08:00", count: 5 },
        { hour: "09:00", count: 12 },
        { hour: "10:00", count: 18 },
        { hour: "11:00", count: 15 },
        { hour: "12:00", count: 8 },
        { hour: "13:00", count: 6 },
        { hour: "14:00", count: 14 },
        { hour: "15:00", count: 16 },
        { hour: "16:00", count: 11 },
        { hour: "17:00", count: 7 },
      ],
    },
  }
}