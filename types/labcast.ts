export interface LabCast {
    _id: string
    title: string
    description: string
    season: number
    episode: number
    hosts: string[]
    guest: string
    guestTitle: string
    thumbnailUrl: string
    spotifyUrl: string
    appleUrl: string
    image: string
    publishedAt: string
    isActive: boolean
    tags: string[]
    duration: number
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  export interface LabCastStats {
    totalEpisodes: number
    totalSeasons: number
    totalHosts: number
    totalGuests: number
    averageDuration: number
    recentEpisodesCount: number
  }
  
  export interface Season {
    season: number
    episodeCount: number
  }
  
  export interface PopularTag {
    tag: string
    count: number
  }
  
  export interface CreateLabCastData {
    title: string
    description: string
    season: number
    episode: number
    hosts: string[]
    guest: string
    guestTitle: string
    thumbnailUrl: string
    spotifyUrl: string
    appleUrl: string
    image: string
    publishedAt: string
    isActive: boolean
    tags: string[]
    duration: number
  }
  