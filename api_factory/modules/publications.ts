import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type PublicationStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published'

export type Publication = {
  id?: string
  title: string
  authors: string
  year: number
  journal: string
  category: string
  link?: string
  abstract?: string
  doi?: string
  pubLink?: string
  doiLink?: string
  status?: PublicationStatus
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type CreatePublicationData = {
  title: string
  authors: string
  year: number
  journal: string
  category: string
  link?: string
  abstract?: string
  doi?: string
  pubLink?: string
  doiLink?: string
}

export type UpdatePublicationData = Partial<CreatePublicationData> & { status?: PublicationStatus }

export type ReviewPublicationData = {
  rejectionReason: string
}

export type PublicationQueryParams = {
  status?: PublicationStatus
}

// API Factory
export const publications_api = {
  $_create_publication: async (publicationData: CreatePublicationData) => {
    const url = `/publications`
    return GATEWAY_ENDPOINT.post(url, publicationData)
  },

  $_get_publications: async (params?: PublicationQueryParams) => {
    const url = `/publications`
    return GATEWAY_ENDPOINT.get(url, { params })
  },

  $_get_published_publications: async () => {
    const url = `/publications/published`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_publication: async (publicationId: string) => {
    const url = `/publications/${publicationId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_update_publication: async (publicationId: string, publicationData: UpdatePublicationData) => {
    const url = `/publications/${publicationId}`
    return GATEWAY_ENDPOINT.patch(url, publicationData)
  },

  $_submit_for_review: async (publicationId: string) => {
    const url = `/publications/${publicationId}/submit-review`
    return GATEWAY_ENDPOINT.patch(url)
  },

  $_approve_publication: async (publicationId: string) => {
    const url = `/publications/${publicationId}/approve`
    return GATEWAY_ENDPOINT.patch(url)
  },

  $_reject_publication: async (publicationId: string, reviewData: ReviewPublicationData) => {
    const url = `/publications/${publicationId}/reject`
    return GATEWAY_ENDPOINT.patch(url, reviewData)
  },

  $_publish_publication: async (publicationId: string) => {
    const url = `/publications/${publicationId}/publish`
    return GATEWAY_ENDPOINT.patch(url)
  },

  $_soft_delete_publication: async (publicationId: string) => {
    const url = `/publications/${publicationId}/soft`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_hard_delete_publication: async (publicationId: string) => {
    const url = `/publications/${publicationId}/hard`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_reorder_publication: async (payload:any) => {
    const url = `/publications/reorder`
    return GATEWAY_ENDPOINT.patch(url, payload)
  },

  $_get_categories: async () => {
    const url = `/journo/categories`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_create_category: async (categoryData: { name: string; description?: string }) => {
    const url = `/journo/categories`
    return GATEWAY_ENDPOINT.post(url, categoryData)
  },

  $_update_category: async (id: string, categoryData: { name?: string; description?: string }) => {
    const url = `/journo/categories/${id}`
    return GATEWAY_ENDPOINT.patch(url, categoryData)
  },

  $_delete_category: async (id: string) => {
    const url = `/journo/categories/${id}`
    return GATEWAY_ENDPOINT.delete(url)
  },
}