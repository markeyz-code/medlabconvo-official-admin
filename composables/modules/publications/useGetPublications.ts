import { ref } from 'vue'
import { publications_api, type Publication, type PublicationQueryParams } from '@/api_factory/modules/publications'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetPublications = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const publications = ref<Publication[]>([])

  const getPublications = async (params?: PublicationQueryParams) => {
    loading.value = true
    error.value = null

    try {
      const response = await publications_api.$_get_publications(params)
      if ([200, 201].includes(response?.status)) {
      publications.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch publications'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    publications.value = []
  }

  return {
    loading,
    error,
    publications,
    getPublications,
    resetState,
  }
}