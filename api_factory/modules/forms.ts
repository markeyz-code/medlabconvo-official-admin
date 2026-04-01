import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type FormFieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file'

export type FormField = {
  id: string
  label: string
  type: FormFieldType
  required?: boolean
  options?: string[]
  placeholder?: string
  description?: string
  validation?: string
}

export type Form = {
  id?: string
  title: string
  bannerImage?: string
  slug?: string
  description?: string
  instructions?: string
  fields: FormField[]
  isActive?: boolean
  submissionsCount?: number
  successMessage?: string
  redirectUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateFormData = {
  title: string
  bannerImage?: string
  description?: string
  instructions?: string
  fields: FormField[]
  successMessage?: string
  redirectUrl?: string
}

export type UpdateFormData = Partial<CreateFormData> & {
  slug?: string
  isActive?: boolean
}

export type FormResponse = {
  fieldId: string
  fieldLabel: string
  value: string
}

export type SubmitFormData = {
  submitterEmail?: string
  responses: FormResponse[]
}

export type FormSubmission = {
  id?: string
  formId: string
  formTitle: string
  submitterEmail?: string
  responses: FormResponse[]
  submitterIp?: string
  userAgent?: string
  createdAt?: string
  updatedAt?: string
}

// API Factory
export const forms_api = {
  $_create_form: async (formData: CreateFormData) => {
    const url = `/forms`
    return GATEWAY_ENDPOINT.post(url, formData)
  },

  $_get_forms: async () => {
    const url = `/forms`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_form: async (formId: string) => {
    const url = `/forms/${formId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_update_form: async (formId: string, formData: UpdateFormData) => {
    const url = `/forms/${formId}`
    return GATEWAY_ENDPOINT.patch(url, formData)
  },

  $_submit_form: async (formId: string, submissionData: SubmitFormData) => {
    const url = `/forms/${formId}/submit`
    return GATEWAY_ENDPOINT.post(url, submissionData)
  },

  $_get_form_submissions: async (formId: string) => {
    const url = `/forms/${formId}/submissions`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_soft_delete_form: async (formId: string) => {
    const url = `/forms/${formId}/soft`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_hard_delete_form: async (formId: string) => {
    const url = `/forms/${formId}/hard`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_restore_form: async (formId: string) => {
    const url = `/forms/${formId}/restore`
    return GATEWAY_ENDPOINT.patch(url)
  },
}