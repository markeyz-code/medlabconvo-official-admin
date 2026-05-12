import { ref } from 'vue'
import { emails_api } from '@/api_factory/modules/emails'

export const useEmailCampaigns = () => {
  const campaigns = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getCampaigns = async () => {
    loading.value = true
    try {
      const response = await emails_api.$_get_campaigns()
      if (response && [200, 201].includes(response.status)) {
        campaigns.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createCampaign = async (data: any) => {
    loading.value = true
    try {
      const response = await emails_api.$_create_campaign(data)
      return response.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const sendCampaign = async (id: string) => {
    loading.value = true
    try {
      const response = await emails_api.$_send_campaign(id)
      return response.data
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
