import { GATEWAY_ENDPOINT } from "../axios.config"

// Enum Definitions
export enum CommunityType {
  INTERNATIONAL = 'international',
  UNIVERSE = 'universe',
  GENERAL = 'general'
}

export enum MemberRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// Type Definitions
export type CommunitySettings = {
  allowSelfJoin: boolean
  requireApproval: boolean
  maxMembers?: number
}

export type CommunityMember = {
  id?: string
  userId: string
  name: string
  email: string
  profileImage?: string
  title?: string
  bio?: string
  role?: MemberRole
  joinedAt?: Date
  isActive?: boolean
}

export type CreateCommunityMemberData = {
  userId: string
  name: string
  email: string
  profileImage?: string
  title?: string
  bio?: string
  role?: MemberRole
}

export type Community = {
  id?: string
  name: string
  description: string
  shortDescription: string
  type: CommunityType
  coverImage?: string
  logoImage?: string
  members?: CommunityMember[]
  memberCount?: number
  isActive?: boolean
  isPublic?: boolean
  handbookUrl?: string
  registrationUrl?: string
  settings?: CommunitySettings
  createdBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export type CreateCommunityData = {
  name: string
  description: string
  shortDescription: string
  type: CommunityType
  coverImage?: string
  logoImage?: string
  members?: CreateCommunityMemberData[]
  isActive?: boolean
  isPublic?: boolean
  handbookUrl?: string
  registrationUrl?: string
  settings?: CommunitySettings
}

export type UpdateCommunityData = Partial<CreateCommunityData>

export type QueryCommunityParams = {
  search?: string
  type?: CommunityType
  isActive?: boolean
  isPublic?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortOrder
}

export type AddMemberData = {
  userId: string
  role?: MemberRole
}

export type UpdateMemberData = {
  role?: MemberRole
  title?: string
  bio?: string
  isActive?: boolean
}

export type CommunityStats = {
  totalCommunities: number
  activeCommunities: number
  publicCommunities: number
  privateCommunities: number
  totalMembers: number
  averageMembersPerCommunity: number
  communitiesByType: {
    [key in CommunityType]: number
  }
  recentCommunities: number
  membershipGrowth: number
}

export type MemberPaginationParams = {
  page?: number
  limit?: number
}

export type FileUploadData = {
  file: File
}

// API Factory
export const community_api = {
  // Community CRUD Operations
  $_create_community: async (communityData: CreateCommunityData) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.post(url, communityData)
  },

  $_get_communities: async (queryParams?: QueryCommunityParams) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { params: queryParams })
  },

  $_get_community: async (communityId: string) => {
    const url = `/communities/${communityId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_update_community: async (communityId: string, updateData: UpdateCommunityData) => {
    const url = `/communities/${communityId}`
    return GATEWAY_ENDPOINT.patch(url, updateData)
  },

  $_delete_community: async (communityId: string) => {
    const url = `/communities/${communityId}`
    return GATEWAY_ENDPOINT.delete(url)
  },

  // Community Statistics and Analytics
  $_get_community_stats: async () => {
    const url = `/communities/stats`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Communities by Type
  $_get_communities_by_type: async (type: CommunityType) => {
    const url = `/communities/type/${type}`
    return GATEWAY_ENDPOINT.get(url)
  },

  // User Communities
  $_get_user_communities: async (userId: string) => {
    const url = `/communities/user/${userId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Member Management
  $_add_member: async (communityId: string, memberData: AddMemberData) => {
    const url = `/communities/${communityId}/members`
    return GATEWAY_ENDPOINT.post(url, memberData)
  },

  $_get_community_members: async (communityId: string, paginationParams?: MemberPaginationParams) => {
    const url = `/communities/${communityId}/members`
    return GATEWAY_ENDPOINT.get(url, { params: paginationParams })
  },

  $_update_member: async (communityId: string, userId: string, updateData: UpdateMemberData) => {
    const url = `/communities/${communityId}/members/${userId}`
    return GATEWAY_ENDPOINT.patch(url, updateData)
  },

  $_remove_member: async (communityId: string, userId: string) => {
    const url = `/communities/${communityId}/members/${userId}`
    return GATEWAY_ENDPOINT.delete(url)
  },

  // File Upload Operations
  $_upload_community_logo: async (communityId: string, file: File) => {
    const url = `/communities/${communityId}/upload-logo`
    const formData = new FormData()
    formData.append('logo', file)
    return GATEWAY_ENDPOINT.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // Utility Methods for Common Operations
  $_search_communities: async (searchTerm: string, limit: number = 20) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        search: searchTerm, 
        limit 
      } 
    })
  },

  $_get_public_communities: async (limit?: number) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        isPublic: true, 
        limit 
      } 
    })
  },

  $_get_private_communities: async (limit?: number) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        isPublic: false, 
        limit 
      } 
    })
  },

  $_get_active_communities: async (limit?: number) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        isActive: true, 
        limit 
      } 
    })
  },

  $_get_inactive_communities: async (limit?: number) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        isActive: false, 
        limit 
      } 
    })
  },

  $_get_international_communities: async (limit?: number) => {
    const url = `/communities/type/${CommunityType.INTERNATIONAL}`
    return GATEWAY_ENDPOINT.get(url, { params: { limit } })
  },

  $_get_universe_communities: async (limit?: number) => {
    const url = `/communities/type/${CommunityType.UNIVERSE}`
    return GATEWAY_ENDPOINT.get(url, { params: { limit } })
  },

  $_get_general_communities: async (limit?: number) => {
    const url = `/communities/type/${CommunityType.GENERAL}`
    return GATEWAY_ENDPOINT.get(url, { params: { limit } })
  },

  $_get_latest_communities: async (limit: number = 10) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        limit, 
        sortBy: 'createdAt', 
        sortOrder: SortOrder.DESC 
      } 
    })
  },

  $_get_popular_communities: async (limit: number = 10) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        limit, 
        sortBy: 'memberCount', 
        sortOrder: SortOrder.DESC 
      } 
    })
  },

  $_get_communities_with_open_registration: async (limit?: number) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        // This would need backend support to filter by settings.allowSelfJoin
        // For now, we'll assume all public communities allow self-join
        isPublic: true,
        limit 
      } 
    })
  },

  $_get_member_role_in_community: async (communityId: string, userId: string) => {
    const url = `/communities/${communityId}/members`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        userId // This would need backend support to filter by specific user
      } 
    })
  },

  $_is_user_member: async (communityId: string, userId: string) => {
    // This would typically be handled by the backend, but we can check through members endpoint
    const url = `/communities/${communityId}/members`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        userId,
        limit: 1 
      } 
    })
  },

  $_get_community_admins: async (communityId: string) => {
    const url = `/communities/${communityId}/members`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        role: MemberRole.ADMIN 
      } 
    })
  },

  $_get_community_moderators: async (communityId: string) => {
    const url = `/communities/${communityId}/members`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        role: MemberRole.MODERATOR 
      } 
    })
  },

  $_get_communities_by_member_count: async (minMembers?: number, maxMembers?: number, limit?: number) => {
    const url = `/communities`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        minMembers, // This would need backend support
        maxMembers, // This would need backend support
        limit 
      } 
    })
  }
}