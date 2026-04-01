import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type LoginCredentials = {
  email: string
  password: string
}

export type SignupData = {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: 'super_admin' | 'admin' | 'editor'
}

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  password: string
}

export type AuthResponse = {
  access_token: string
  user: AuthUser
}

// API Factory
export const auth_api = {
  $_login: async (credentials: LoginCredentials) => {
    const url = `/auth/login`
    return GATEWAY_ENDPOINT.post(url, credentials)
  },

  $_signup: async (userData: SignupData, token?: string) => {
    const url = token ? `/auth/register?token=${token}` : `/auth/register`
    return GATEWAY_ENDPOINT.post(url, userData)
  },
  $_verify_email: async (token: string) => {
    const url = `/auth/verify-email/${token}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_forgot_password: async (payload: ForgotPasswordPayload) => {
    const url = `/auth/forgot-password`
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  $_reset_password: async (token: string, payload: ResetPasswordPayload) => {
    const url = `/auth/reset-password/${token}`
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  $_verify_otp: async (payload: { email: string, otp: string }) => {
    const url = `/auth/verify-otp`
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  $_verify_login_otp: async (payload: { email: string, otp: string }) => {
    const url = `/auth/verify-login-otp`
    return GATEWAY_ENDPOINT.post(url, payload)
  },
}