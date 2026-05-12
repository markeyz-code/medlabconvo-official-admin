import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type Enquiry = {
  id?: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  message: string
  isRead?: boolean
  isReplied?: boolean
  createdAt?: string
  updatedAt?: string
}

export type CreateEnquiryData = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  message: string
}

// API Factory
export const enquiries_api = {
  $_create_enquiry: async (enquiryData: CreateEnquiryData) => {
    const url = `/enquiries`
    return GATEWAY_ENDPOINT.post(url, enquiryData)
  },

  $_get_enquiries: async () => {
    const url = `/enquiries`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_enquiry: async (enquiryId: string) => {
    const url = `/enquiries/${enquiryId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_soft_delete_enquiry: async (enquiryId: string) => {
    const url = `/enquiries/${enquiryId}/soft`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_hard_delete_enquiry: async (enquiryId: string) => {
    const url = `/enquiries/${enquiryId}/hard`
    return GATEWAY_ENDPOINT.delete(url)
  },
}