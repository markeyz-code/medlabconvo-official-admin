import { ref } from 'vue'
import { publications_api } from '@/api_factory/modules/publications'
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useHardDeletePublication = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const { showToast } = useCustomToast()

  const hardDeletePublication = async (publicationId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await publications_api.$_hard_delete_publication(publicationId)
      showToast({
        title: "Success",
        message: "Publication was permanently deleted!!!",
        toastType: "success",
      })
      success.value = true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to permanently delete publication'
      showToast({
        title: "Error",
        message:err.response?.data?.message || 'Failed to permanently delete publication',
        toastType: "error",
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
  }

  return {
    loading,
    error,
    success,
    hardDeletePublication,
    resetState,
  }
}