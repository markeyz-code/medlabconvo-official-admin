import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type ProgramStatus = 'draft' | 'active' | 'inactive' | 'archived'
export type FormFieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file'

export type FormField = {
  id: string
  label: string
  type: FormFieldType
  required?: boolean
  options?: string[]
  placeholder?: string
  description?: string
}

export type Highlight = {
  title: string
  description: string
}

export type Speaker = {
  name?: string
  bio?: string
  image?: string
}

export type Program = {
  id?: string
  title: string
  slug?: string
  category?: string
  description?: string
  duration?: string
  focusAreas?: string[]
  outcomes?: string[]
  keyResponsibilities?: string[]
  image?: string
  highlights?: Highlight[]
  status?: ProgramStatus
  registrationToken?: string
  formFields?: FormField[]
  formTitle?: string
  formInstructions?: string
  applicationsCount?: number
  form?: any
  speakers?: Speaker[]
  createdAt?: string
  updatedAt?: string
}

export type CreateProgramData = {
  title: string
  category?: string
  description?: string
  duration?: string
  focusAreas?: string[]
  outcomes?: string[]
  keyResponsibilities?: string[]
  image?: string
  highlights?: Highlight[]
  formFields?: FormField[]
  formTitle?: string
  formInstructions?: string
  formId?: string
  speakers?: Speaker[]
}

export type UpdateProgramData = Partial<CreateProgramData>

export type FormResponse = {
  fieldId: string
  fieldLabel: string
  value: string
}

export type SubmitApplicationData = {
  applicantEmail: string
  responses: FormResponse[]
}

export type ProgramApplication = {
  id?: string
  programId: string
  programTitle: string
  applicantEmail: string
  responses: FormResponse[]
  status?: string
  reviewedBy?: string
  reviewedAt?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export type ProgramQueryParams = {
  status?: ProgramStatus
  page?: number
  limit?: number
  search?: string
  category?: string
}

// API Factory
export const programs_api = {
  $_create_program: async (programData: CreateProgramData) => {
    const url = `/programs`
    return GATEWAY_ENDPOINT.post(url, programData)
  },

  $_get_programs: async (params?: ProgramQueryParams) => {
    const url = `/programs`
    return GATEWAY_ENDPOINT.get(url, { params })
  },

  $_get_active_programs: async () => {
    const url = `/programs/active`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_program: async (programId: string) => {
    const url = `/programs/${programId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_update_program: async (programId: string, programData: UpdateProgramData) => {
    const url = `/programs/${programId}`
    return GATEWAY_ENDPOINT.patch(url, programData)
  },

  $_activate_program: async (programId: string) => {
    const url = `/programs/${programId}/activate`
    return GATEWAY_ENDPOINT.patch(url)
  },

  $_deactivate_program: async (programId: string) => {
    const url = `/programs/${programId}/deactivate`
    return GATEWAY_ENDPOINT.patch(url)
  },

  $_get_registration_link: async (programId: string) => {
    const url = `/programs/${programId}/registration-link`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_submit_application: async (token: string, applicationData: SubmitApplicationData) => {
    const url = `/programs/apply/${token}`
    return GATEWAY_ENDPOINT.post(url, applicationData)
  },

  $_get_applications: async (programId: string) => {
    const url = `/programs/${programId}/applications`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_soft_delete_program: async (programId: string) => {
    const url = `/programs/${programId}/soft`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_hard_delete_program: async (programId: string) => {
    const url = `/programs/${programId}/hard`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_restore_program: async (programId: string) => {
    const url = `/programs/${programId}/restore`
    return GATEWAY_ENDPOINT.patch(url)
  },

  $_reorder_programs: async (payload: any) => {
    const url = '/programs/reorder'
    return GATEWAY_ENDPOINT.patch(url, payload)
  }
}