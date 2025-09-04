import type { Project, Collection, Sample } from "../types"

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Biodiversidade da Mata Atlântica",
    description: "Estudo da diversidade de espécies na região costeira",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    collectionsCount: 15,
    samplesCount: 45,
  },
  {
    id: "2",
    name: "Fauna Aquática do Pantanal",
    description: "Levantamento de peixes e invertebrados aquáticos",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-10",
    collectionsCount: 8,
    samplesCount: 24,
  },
  {
    id: "3",
    name: "Flora do Cerrado",
    description: "Catalogação de plantas nativas do cerrado brasileiro",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
    collectionsCount: 22,
    samplesCount: 67,
  },
]

export const mockCollections: Collection[] = [
  {
    id: "1",
    projectId: "1",
    species: "Cecropia pachystachya",
    location: "Trilha do Morro, Parque Nacional",
    date: "2024-01-20",
    time: "08:30",
    responsible: "Dr. Maria Silva",
    notes: "Espécime encontrado em área de regeneração",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    samplesCount: 3,
    images: [],
  },
  {
    id: "2",
    projectId: "1",
    species: "Morpho menelaus",
    location: "Área de preservação permanente",
    date: "2024-01-21",
    time: "14:15",
    responsible: "Prof. João Santos",
    notes: "Borboleta observada próxima ao riacho",
    createdAt: "2024-01-21",
    updatedAt: "2024-01-21",
    samplesCount: 1,
    images: [],
  },
]

export const mockSamples: Sample[] = [
  {
    id: "1",
    collectionId: "1",
    description: "Folha jovem da copa",
    identificationCode: "CP-001-F1",
    container: "Envelope de papel",
    state: "dried",
    observations: "Folha coletada da parte superior da árvore",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    images: [],
  },
  {
    id: "2",
    collectionId: "1",
    description: "Fragmento de casca",
    identificationCode: "CP-001-C1",
    container: "Tubo falcon 50ml",
    state: "fresh",
    observations: "Casca coletada a 1.5m do solo",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    images: [],
  },
]
