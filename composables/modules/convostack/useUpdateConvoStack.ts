import { ref } from 'vue'
import { convostack_api } from '@/api_factory/modules/convostack'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useUpdateConvoStack = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const updatePublication = async (id: string, payload: any) => {
    loading.value = true
    try {
      const response = await convostack_api.$_update_publication(id, payload)
      showToast({
        title: 'Success',
        message: 'Publication updated successfully.',
        toastType: 'success'
      })
      return response.data
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update publication',
        toastType: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  return { updatePublication, loading }
}
