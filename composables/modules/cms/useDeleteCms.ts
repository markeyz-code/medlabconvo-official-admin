import { ref } from 'vue'
import { cms_api } from '@/api_factory/modules/cms'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useDeleteCms = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const deleteCms = async (key: string) => {
    loading.value = true
    try {
      const response = await cms_api.$_delete_cms(key)
      showToast({
        title: 'Success',
        message: 'Content deleted successfully',
        toastType: 'success',
        duration: 3000
      })
      return response.data
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to delete content',
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
    deleteCms
  }
}
