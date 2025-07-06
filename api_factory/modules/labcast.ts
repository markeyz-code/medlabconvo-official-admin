import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type LabCast = {
  id?: string
  title: string
  description: string
  image: string
  season: number
  episode: number
  hosts: string[]
  guest: string
  guestTitle: string
  thumbnailUrl: string
  spotifyUrl: string
  appleUrl: string
  publishedAt?: Date
  tags?: string[]
  duration?: number
  transcriptUrl?: string
  notes?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type CreateLabCastData = {
  title: string
  description: string
  image: string
  season: number
  episode: number
  hosts: string[]
  guest: string
  guestTitle: string
  thumbnailUrl: string
  spotifyUrl: string
  appleUrl: string
  publishedAt?: Date
  tags?: string[]
  duration?: number
  transcriptUrl?: string
  notes?: string
  isActive?: boolean
}

export type UpdateLabCastData = Partial<CreateLabCastData>

export type QueryLabCastParams = {
  page?: number
  limit?: number
  season?: number
  tags?: string[]
  search?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type LabCastStats = {
  totalEpisodes: number
  totalSeasons: number
  totalHosts: number
  totalGuests: number
  averageDuration: number
  recentEpisodes: number
}

export type SeasonData = {
  season: number
  episodeCount: number
  latestEpisode: Date
}

export type PopularTag = {
  tag: string
  count: number
}

// API Factory
export const labcast_api = {
  // Create single LabCast episode
  $_create_labcast: async (labcastData: CreateLabCastData) => {
    const url = `/labcast`
    return GATEWAY_ENDPOINT.post(url, labcastData)
  },

  // Create multiple LabCast episodes in batch
  $_batch_create_labcast: async (labcastData: CreateLabCastData[]) => {
    const url = `/labcast/batch`
    return GATEWAY_ENDPOINT.post(url, labcastData)
  },

  // Get all LabCast episodes with filtering and pagination
  $_get_labcasts: async (queryParams?: QueryLabCastParams) => {
    // const url = `/labcast`
    // return GATEWAY_ENDPOINT.get(url, { params: queryParams })
    const url = `/labcast?limit=1000000`
    return GATEWAY_ENDPOINT.get(url, { params: queryParams })
  },

  // Get all available seasons
  $_get_seasons: async () => {
    const url = `/labcast/seasons`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get LabCast statistics
  $_get_stats: async () => {
    const url = `/labcast/stats`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get popular tags
  $_get_popular_tags: async () => {
    const url = `/labcast/tags`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get episodes by season
  $_get_episodes_by_season: async (season: number) => {
    const url = `/labcast/season/${season}`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get specific episode by season and episode number
  $_get_episode_by_season_and_episode: async (season: number, episode: number) => {
    const url = `/labcast/season/${season}/episode/${episode}`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get LabCast episode by ID
  $_get_labcast: async (labcastId: string) => {
    const url = `/labcast/${labcastId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Update LabCast episode
  $_update_labcast: async (labcastId: string, updateData: UpdateLabCastData) => {
    const url = `/labcast/${labcastId}`
    return GATEWAY_ENDPOINT.patch(url, updateData)
  },

  // Delete LabCast episode
  $_delete_labcast: async (labcastId: string) => {
    const url = `/labcast/${labcastId}`
    return GATEWAY_ENDPOINT.delete(url)
  },

  // Utility methods for common operations
  $_get_latest_episodes: async (limit: number = 10) => {
    const url = `/labcast`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        limit, 
        sortBy: 'publishedAt', 
        sortOrder: 'desc' 
      } 
    })
  },

  $_search_episodes: async (searchTerm: string, limit: number = 20) => {
    const url = `/labcast`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        search: searchTerm, 
        limit 
      } 
    })
  },

  $_get_episodes_by_host: async (hostName: string) => {
    const url = `/labcast`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        search: hostName // Assuming backend searches in hosts array
      } 
    })
  },

  $_get_episodes_by_guest: async (guestName: string) => {
    const url = `/labcast`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        search: guestName // Assuming backend searches in guest field
      } 
    })
  },

  $_get_episodes_by_tags: async (tags: string[]) => {
    const url = `/labcast`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        tags 
      } 
    })
  },

  $_get_active_episodes: async (queryParams?: QueryLabCastParams) => {
    const url = `/labcast`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        ...queryParams, 
        isActive: true 
      } 
    })
  }
}