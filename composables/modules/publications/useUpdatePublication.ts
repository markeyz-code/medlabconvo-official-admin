import { ref } from 'vue'
import { publications_api, type UpdatePublicationData, type Publication } from '@/api_factory/modules/publications'
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useUpdatePublication = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const publicationData = ref<Publication | null>(null)
  const { showToast } = useCustomToast()

  const updatePublication = async (publicationId: string, publicationPayload: UpdatePublicationData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await publications_api.$_update_publication(publicationId, publicationPayload)
      success.value = true
      publicationData.value = response.data
      showToast({
        title: "Success",
        message: "Publication Updated Successfully!!!",
        toastType: "success",
      })
      return response.data
    } catch (err: any) {
      showToast({
        title: "Error",
        message: error.value = err.response?.data?.message || 'Failed to update publication',
        toastType: "error",
      })
      error.value = err.response?.data?.message || 'Failed to update publication'
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
    updatePublication,
    resetState,
  }
}