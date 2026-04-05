import { ref } from 'vue'
import { useUser } from '@/composables/modules/auth/user'

export const useEmailCampaigns = () => {
  const campaigns = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const { token } = useUser()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase || 'https://medlab-api.onrender.com/api/v1'

  const getCampaigns = async () => {
    loading.value = true
    try {
      const response = await fetch(`${baseUrl}/emails/campaigns`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      campaigns.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createCampaign = async (data: any) => {
    loading.value = true
    try {
      const response = await fetch(`${baseUrl}/emails/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const sendCampaign = async (id: string) => {
    loading.value = true
    try {
      const response = await fetch(`${baseUrl}/emails/campaigns/${id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      return await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    campaigns,
    loading,
    error,
    getCampaigns,
    createCampaign,
    sendCampaign
  }
}
