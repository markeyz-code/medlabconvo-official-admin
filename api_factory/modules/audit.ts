import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type AuditAction = 'create' | 'update' | 'delete' | 'soft_delete' | 'restore' | 'login' | 'logout'

export type AuditLog = {
  id?: string
  userId: string
  action: AuditAction
  resource: string
  resourceId?: string
  metadata?: Record<string, any>
  ip?: string
  userAgent?: string
  createdAt?: string
  updatedAt?: string
}

export type AuditQueryParams = {
  limit?: number
  skip?: number
}

// API Factory
export const audit_api = {
  $_get_audit_logs: async (params?: AuditQueryParams) => {
    const url = `/audit`
    return GATEWAY_ENDPOINT.get(url, { params })
  },

  $_get_user_audit_logs: async (userId: string, limit?: number) => {
    const url = `/audit/user/${userId}`
    const params = limit ? { limit } : undefined
    return GATEWAY_ENDPOINT.get(url, { params })
  },

  $_get_resource_audit_logs: async (resource: string, resourceId?: string) => {
    const url = `/audit/resource/${resource}`
    const params = resourceId ? { resourceId } : undefined
    return GATEWAY_ENDPOINT.get(url, { params })
  },
}