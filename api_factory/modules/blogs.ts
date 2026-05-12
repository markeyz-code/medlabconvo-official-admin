import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type BlogStatus = 'draft' | 'published' | 'archived'

export type Blog = {
  id?: string
  title: string
  slug?: string
  content: string
  excerpt?: string
  featuredImage?: string
  tags?: string[]
  category?: string
  status?: BlogStatus
  authorId?: string
  authorName?: string
  publishedAt?: string
  viewCount?: number
  metaTitle?: string
  metaDescription?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateBlogData = {
  title: string
  content: string
  excerpt?: string
  featuredImage?: string
  tags?: string[]
  category?: string
  authorName?: string
  metaTitle?: string
  metaDescription?: string
}

export type UpdateBlogData = Partial<CreateBlogData> & {
  slug?: string
}

export type BlogQueryParams = {
  status?: BlogStatus
}

// API Factory
export const blogs_api = {
  $_create_blog: async (blogData: CreateBlogData) => {
    const url = `/blogs`
    return GATEWAY_ENDPOINT.post(url, blogData)
  },

  $_get_blogs: async (params?: BlogQueryParams) => {
    const url = `/blogs`
    return GATEWAY_ENDPOINT.get(url, { params })
  },

  $_get_published_blogs: async () => {
    const url = `/blogs/published`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_blog: async (blogId: string) => {
    const url = `/blogs/${blogId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_update_blog: async (blogId: string, blogData: UpdateBlogData) => {
    const url = `/blogs/${blogId}`
    return GATEWAY_ENDPOINT.patch(url, blogData)
  },

  $_publish_blog: async (blogId: string) => {
    const url = `/blogs/${blogId}/publish`
    return GATEWAY_ENDPOINT.patch(url)
  },

  $_unpublish_blog: async (blogId: string) => {
    const url = `/blogs/${blogId}/unpublish`
    return GATEWAY_ENDPOINT.patch(url)
  },

  $_soft_delete_blog: async (blogId: string) => {
    const url = `/blogs/${blogId}/soft`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_hard_delete_blog: async (blogId: string) => {
    const url = `/blogs/${blogId}/hard`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_restore_blog: async (blogId: string) => {
    const url = `/blogs/${blogId}/restore`
    return GATEWAY_ENDPOINT.patch(url)
  },
}