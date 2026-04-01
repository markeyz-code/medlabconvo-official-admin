import { ref } from 'vue'
import { convostack_api } from '@/api_factory/modules/convostack'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCreateConvoStack = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const createPublication = async (payload: any) => {
    loading.value = true
    try {
      const response = await convostack_api.$_create_publication(payload)
      showToast({
        title: 'Success',
        message: 'ConvoStack publication created successfully.',
        toastType: 'success'
      })
      return response.data
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create publication',
        toastType: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  return { createPublication, loading }
}
