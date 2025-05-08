import { create } from "zustand"
import { persist } from "zustand/middleware"

// Video types
export type Video = {
  id: string
  title: string
  description: string
  category: string
  youtubeId: string
  date: string
}

// Tutorial types
export type Tutorial = {
  id: string
  title: string
  description: string
  type: string
  fileSize: string
  category: string
  date: string
}

// Patent types
export type Patent = {
  id: string
  title: string
  abstract: string
  inventors: string[]
  filingDate: string
  issueDate: string | null
  status: string
}

// Initial data
const initialVideos: Video[] = [
  {
    id: "1",
    title: "Introduction to Quantum Computing",
    description: "Learn the basics of quantum computing and how it differs from classical computing.",
    category: "basics",
    youtubeId: "JhHMJCUmq28",
    date: "2023-05-15",
  },
  {
    id: "2",
    title: "QRAM Architecture Explained",
    description: "A deep dive into the architecture of Quantum Random Access Memory.",
    category: "advanced",
    youtubeId: "F_Riqjdh2oM",
    date: "2023-06-22",
  },
  {
    id: "3",
    title: "Quantum Algorithms for Beginners",
    description: "Understanding the fundamental algorithms used in quantum computing.",
    category: "basics",
    youtubeId: "0ORqGVCHM6k",
    date: "2023-07-10",
  },
  {
    id: "4",
    title: "Quantum Error Correction",
    description: "How to implement error correction in quantum systems to improve reliability.",
    category: "advanced",
    youtubeId: "h7r-wRUGp8Q",
    date: "2023-08-05",
  },
  {
    id: "5",
    title: "Quantum Computing Applications",
    description: "Real-world applications and use cases for quantum computing technology.",
    category: "applications",
    youtubeId: "OdVSNNvWikQ",
    date: "2023-09-18",
  },
  {
    id: "6",
    title: "QRAM in Machine Learning",
    description: "How QRAM technology is accelerating machine learning algorithms.",
    category: "applications",
    youtubeId: "Lbndu5EIWvI",
    date: "2023-10-30",
  },
]

const initialTutorials: Tutorial[] = [
  {
    id: "1",
    title: "Getting Started with QRAM",
    description: "A beginner's guide to understanding and working with Quantum Random Access Memory.",
    type: "pdf",
    fileSize: "2.4 MB",
    category: "beginner",
    date: "2023-04-10",
  },
  {
    id: "2",
    title: "Quantum Computing Fundamentals",
    description: "Learn the core principles of quantum computing that power QRAM technology.",
    type: "pdf",
    fileSize: "3.8 MB",
    category: "beginner",
    date: "2023-05-22",
  },
  {
    id: "3",
    title: "QRAM Implementation Strategies",
    description: "Advanced techniques for implementing QRAM in various quantum computing architectures.",
    type: "pdf",
    fileSize: "5.1 MB",
    category: "advanced",
    date: "2023-06-15",
  },
  {
    id: "4",
    title: "Quantum Algorithms for Data Retrieval",
    description: "How to optimize data retrieval using quantum algorithms with QRAM.",
    type: "ppt",
    fileSize: "8.7 MB",
    category: "advanced",
    date: "2023-07-30",
  },
  {
    id: "5",
    title: "QRAM in Machine Learning Applications",
    description: "Presentation on integrating QRAM with machine learning workflows.",
    type: "ppt",
    fileSize: "12.3 MB",
    category: "application",
    date: "2023-08-18",
  },
  {
    id: "6",
    title: "Quantum Memory Management",
    description: "Best practices for managing quantum memory resources efficiently.",
    type: "pdf",
    fileSize: "4.2 MB",
    category: "intermediate",
    date: "2023-09-05",
  },
]

const initialPatents: Patent[] = [
  {
    id: "US10123456",
    title: "Quantum Memory Architecture for Efficient Data Retrieval",
    abstract:
      "A novel architecture for quantum random access memory that enables efficient data retrieval with reduced quantum resource requirements.",
    inventors: ["Jane Smith", "John Doe"],
    filingDate: "2020-03-15",
    issueDate: "2022-05-10",
    status: "Granted",
  },
  {
    id: "US10789012",
    title: "Method for Quantum State Preservation in QRAM",
    abstract:
      "A method for preserving quantum states in QRAM systems, extending coherence time and improving reliability of quantum memory operations.",
    inventors: ["Robert Johnson", "Maria Garcia"],
    filingDate: "2019-11-22",
    issueDate: "2021-08-30",
    status: "Granted",
  },
  {
    id: "US11234567",
    title: "Quantum Error Correction for Memory Systems",
    abstract:
      "A system and method for implementing error correction in quantum memory systems to improve data integrity and reliability.",
    inventors: ["David Chen", "Sarah Williams"],
    filingDate: "2021-02-18",
    issueDate: "2023-01-25",
    status: "Granted",
  },
  {
    id: "US20220123456",
    title: "Scalable QRAM Implementation for Large-Scale Quantum Computing",
    abstract:
      "A scalable implementation of quantum random access memory designed for large-scale quantum computing applications with minimal overhead.",
    inventors: ["Michael Brown", "Lisa Taylor"],
    filingDate: "2022-04-05",
    issueDate: null,
    status: "Pending",
  },
  {
    id: "US20230098765",
    title: "Hybrid Quantum-Classical Memory Interface",
    abstract:
      "An interface system that enables efficient data transfer between classical and quantum memory systems for hybrid computing applications.",
    inventors: ["James Wilson", "Emily Rodriguez"],
    filingDate: "2023-01-12",
    issueDate: null,
    status: "Pending",
  },
]

// Store type
type StoreState = {
  videos: Video[]
  tutorials: Tutorial[]
  patents: Patent[]
  addVideo: (video: Video) => void
  updateVideo: (id: string, video: Partial<Video>) => void
  deleteVideo: (id: string) => void
  addTutorial: (tutorial: Tutorial) => void
  updateTutorial: (id: string, tutorial: Partial<Tutorial>) => void
  deleteTutorial: (id: string) => void
  addPatent: (patent: Patent) => void
  updatePatent: (id: string, patent: Partial<Patent>) => void
  deletePatent: (id: string) => void
}

// Create store with persistence
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      videos: initialVideos,
      tutorials: initialTutorials,
      patents: initialPatents,

      // Video actions
      addVideo: (video) => set((state) => ({ videos: [...state.videos, video] })),

      updateVideo: (id, updatedVideo) =>
        set((state) => {
          console.log("Store updating video:", id, updatedVideo)
          return {
            videos: state.videos.map((video) => (video.id === id ? { ...video, ...updatedVideo } : video)),
          }
        }),

      deleteVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id),
        })),

      // Tutorial actions
      addTutorial: (tutorial) => set((state) => ({ tutorials: [...state.tutorials, tutorial] })),

      updateTutorial: (id, updatedTutorial) =>
        set((state) => ({
          tutorials: state.tutorials.map((tutorial) =>
            tutorial.id === id ? { ...tutorial, ...updatedTutorial } : tutorial,
          ),
        })),

      deleteTutorial: (id) =>
        set((state) => ({
          tutorials: state.tutorials.filter((tutorial) => tutorial.id !== id),
        })),

      // Patent actions
      addPatent: (patent) => set((state) => ({ patents: [...state.patents, patent] })),

      updatePatent: (id, updatedPatent) =>
        set((state) => ({
          patents: state.patents.map((patent) => (patent.id === id ? { ...patent, ...updatedPatent } : patent)),
        })),

      deletePatent: (id) =>
        set((state) => ({
          patents: state.patents.filter((patent) => patent.id !== id),
        })),
    }),
    {
      name: "qram-storage",
    },
  ),
)
