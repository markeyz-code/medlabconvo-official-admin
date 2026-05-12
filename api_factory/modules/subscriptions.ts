import { GATEWAY_ENDPOINT } from "../axios.config"

// Type Definitions
export type Subscription = {
  id?: string
  email: string
  isActive?: boolean
  unsubscribedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateSubscriptionData = {
  email: string
}

// API Factory
export const subscriptions_api = {
  $_create_subscription: async (subscriptionData: CreateSubscriptionData) => {
    const url = `/subscriptions`
    return GATEWAY_ENDPOINT.post(url, subscriptionData)
  },

  $_get_subscriptions: async () => {
    const url = `/subscriptions`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_subscription: async (subscriptionId: string) => {
    const url = `/subscriptions/${subscriptionId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_unsubscribe: async (email: string) => {
    const url = `/subscriptions/unsubscribe/${email}`
    return GATEWAY_ENDPOINT.patch(url)
  },

  $_soft_delete_subscription: async (subscriptionId: string) => {
    const url = `/subscriptions/${subscriptionId}/soft`
    return GATEWAY_ENDPOINT.delete(url)
  },

  $_hard_delete_subscription: async (subscriptionId: string) => {
    const url = `/subscriptions/${subscriptionId}/hard`
    return GATEWAY_ENDPOINT.delete(url)
  },
}