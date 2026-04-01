import { ref } from 'vue'
import { convostack_api } from '@/api_factory/modules/convostack'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useDeleteConvoStack = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const deletePublication = async (id: string) => {
    loading.value = true
    try {
      await convostack_api.$_delete_publication(id)
      showToast({
        title: 'Success',
        message: 'Publication deleted successfully.',
        toastType: 'success'
      })
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete publication',
        toastType: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  return { deletePublication, loading }
}
