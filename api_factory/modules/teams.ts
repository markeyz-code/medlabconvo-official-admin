import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type Profile = {
  type: string
  url: string
}

export type Publication = {
  title: string
  authors: string
  year: number
  journal: string
  doi?: string
  pubLink?: string
  doiLink?: string
}

export type TeamMember = {
  id?: string
  _id?: string
  image?: string
  name: string
  initials: string
  title: string
  isActive?: boolean
  position: number
  profiles: Profile[]
  bio: string
  methods?: string[]
  publications?: Publication[]
  createdAt?: string
  updatedAt?: string
}

export type CreateTeamMemberData = {
  image?: string
  name: string
  initials: string
  title: string
  isActive?: boolean
  position: number
  profiles: Profile[]
  bio: string
  methods?: string[]
  publications?: Publication[]
}

export type UpdateTeamMemberData = Partial<CreateTeamMemberData>

// API Factory
export const teams_api = {
  $_create_team_member: async (memberData: CreateTeamMemberData) => {
    const url = `/teams`
    return GATEWAY_ENDPOINT.post(url, memberData)
  },

  $_get_team_members: async () => {
    const url = `/teams`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_team_member: async (memberId: string) => {
    const url = `/teams/${memberId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_update_team_member: async (memberId: string, memberData: UpdateTeamMemberData) => {
    const url = `/teams/${memberId}`
    return GATEWAY_ENDPOINT.patch(url, memberData)
  },

  $_soft_delete_team_member: async (memberId: string) => {
    const url = `/teams/${memberId}/soft`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_hard_delete_team_member: async (memberId: string) => {
    const url = `/teams/${memberId}/hard`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_restore_team_member: async (memberId: string) => {
    const url = `/teams/${memberId}/restore`
    return GATEWAY_ENDPOINT.patch(url)
  },
}