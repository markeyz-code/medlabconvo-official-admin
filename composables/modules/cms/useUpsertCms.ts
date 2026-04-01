import { ref } from 'vue'
import { cms_api, type UpsertCmsPayload } from '@/api_factory/modules/cms'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useUpsertCms = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const upsertCms = async (payload: UpsertCmsPayload) => {
    loading.value = true
    try {
      const response = await cms_api.$_upsert_cms(payload)
      showToast({
        title: 'Success',
        message: 'Content updated successfully',
        toastType: 'success',
        duration: 3000
      })
      return response.data
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to update content',
        toastType: 'error',
        duration: 3000
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    upsertCms
  }
}
