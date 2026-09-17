import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type Profile = {
  type: string
  url: string
}

export type TeamCategory = {
  _id?: string
  name: string
  position: number
}

export type CreateTeamCategoryData = {
  name: string
  position?: number
}

export type UpdateTeamCategoryData = Partial<CreateTeamCategoryData>

export type TeamMember = {
  id?: string // slug
  _id?: string
  image?: string
  name: string
  roleCategory: string
  title: string
  position: number
  profiles: Profile[]
  bio: string
  achievements: string[]
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export type CreateTeamMemberData = {
  image?: string
  name: string
  roleCategory: string
  title: string
  position: number
  profiles: Profile[]
  bio: string
  achievements: string[]
}

export type UpdateTeamMemberData = Partial<CreateTeamMemberData>

// API Factory
export const teams_api = {
  // Categories
  $_create_category: async (data: CreateTeamCategoryData) => {
    return GATEWAY_ENDPOINT.post('/teams/categories', data)
  },

  $_get_categories: async () => {
    return GATEWAY_ENDPOINT.get('/teams/categories')
  },

  $_update_category: async (id: string, data: UpdateTeamCategoryData) => {
    return GATEWAY_ENDPOINT.patch(`/teams/categories/${id}`, data)
  },

  $_delete_category: async (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/teams/categories/${id}`)
  },

  // Members
  $_create_member: async (memberData: CreateTeamMemberData) => {
    return GATEWAY_ENDPOINT.post('/teams', memberData)
  },

  $_get_members: async () => {
    return GATEWAY_ENDPOINT.get('/teams')
  },

  $_get_member: async (id: string) => {
    return GATEWAY_ENDPOINT.get(`/teams/${id}`)
  },

  $_update_member: async (id: string, memberData: UpdateTeamMemberData) => {
    return GATEWAY_ENDPOINT.patch(`/teams/${id}`, memberData)
  },

  $_delete_member: async (id: string, hard: boolean = false) => {
    const url = `/teams/${id}/${hard ? 'hard' : 'soft'}`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_restore_member: async (id: string) => {
    return GATEWAY_ENDPOINT.patch(`/teams/${id}/restore`)
  },
}