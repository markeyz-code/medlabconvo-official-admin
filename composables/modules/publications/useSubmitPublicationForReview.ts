import { ref } from 'vue'
import { publications_api, type Publication } from '@/api_factory/modules/publications'
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useSubmitForReview = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const publicationData = ref<Publication | null>(null)
  const { showToast } = useCustomToast()
  
  const submitForReview = async (publicationId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await publications_api.$_submit_for_review(publicationId)
      success.value = true
      publicationData.value = response.data
      showToast({
        title: "Success",
        message: "Publication submited for review Successfully!!!",
        toastType: "success",
      })
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to submit publication for review'
      showToast({
        title: "Error",
        message: err.response?.data?.message || 'Failed to submit publication for review',
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
    publicationData.value = null
  }

  return {
    loading,
    error,
    success,
    publicationData,
    submitForReview,
    resetState,
  }
}