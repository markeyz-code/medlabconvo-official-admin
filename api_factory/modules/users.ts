import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type User = {
  id?: string
  firstName: string
  lastName: string
  email: string
  password?: string
  role: 'super_admin' | 'admin' | 'editor'
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type CreateUserData = {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: 'super_admin' | 'admin' | 'editor'
}

export type UpdateUserData = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  role?: 'super_admin' | 'admin' | 'editor'
  isActive?: boolean
}

// API Factory
export const users_api = {
  $_create_user: async (userData: CreateUserData) => {
    const url = `/users`
    return GATEWAY_ENDPOINT.post(url, userData)
  },

  $_get_users: async () => {
    const url = `/users`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_user: async (userId: string) => {
    const url = `/users/${userId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_update_user: async (userId: string, userData: UpdateUserData) => {
    const url = `/users/${userId}`
    return GATEWAY_ENDPOINT.patch(url, userData)
  },

  $_soft_delete_user: async (userId: string) => {
    const url = `/users/${userId}/soft`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_hard_delete_user: async (userId: string) => {
    const url = `/users/${userId}/hard`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_restore_user: async (userId: string) => {
    const url = `/users/${userId}/restore`
    return GATEWAY_ENDPOINT.patch(url)
  },
}