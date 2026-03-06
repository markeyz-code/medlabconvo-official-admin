import { ref } from 'vue'
import { publications_api, type Publication } from '@/api_factory/modules/publications'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const usePublishPublication = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const publicationData = ref<Publication | null>(null)

  const publishPublication = async (publicationId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await publications_api.$_publish_publication(publicationId)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      publicationData.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to publish publication'
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
    publishPublication,
    resetState,
  }
}