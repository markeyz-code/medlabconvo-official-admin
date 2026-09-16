import { GATEWAY_ENDPOINT } from "../axios.config"

export type ShortReadStatus = 'draft' | 'published'

export type SlideDto = {
  type: string
  content?: string
  mediaUrl?: string
  title?: string
}

export type ShortRead = {
  _id?: string
  title: string
  slug?: string
  coverImageUrl: string
  author?: string
  slides?: SlideDto[]
  status?: ShortReadStatus
  createdAt?: string
  updatedAt?: string
}

export type CreateShortReadData = {
  title: string
  coverImageUrl: string
  author?: string
  slides?: SlideDto[]
  status?: ShortReadStatus
}

export type UpdateShortReadData = Partial<CreateShortReadData> & {
  slug?: string
}

export type ShortReadQueryParams = {
  status?: ShortReadStatus
}

export const short_reads_api = {
  $_create_short_read: async (data: CreateShortReadData) => {
    return GATEWAY_ENDPOINT.post('/short-reads', data)
  },

  $_get_short_reads: async (params?: ShortReadQueryParams) => {
    return GATEWAY_ENDPOINT.get('/short-reads', { params })
  },

  $_get_short_read_by_id: async (id: string) => {
    return GATEWAY_ENDPOINT.get(`/short-reads/id/${id}`)
  },

  $_update_short_read: async (id: string, data: UpdateShortReadData) => {
    return GATEWAY_ENDPOINT.patch(`/short-reads/${id}`, data)
  },

  $_delete_short_read: async (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/short-reads/${id}`)
  }
}
