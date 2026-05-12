import { ref } from 'vue'
import { enquiries_api, type Enquiry } from '@/api_factory/modules/enquiries'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetEnquiries = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const enquiries = ref<Enquiry[]>([])

  const getEnquiries = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await enquiries_api.$_get_enquiries()
      if ([200, 201].includes(response?.status)) {
        enquiries.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch enquiries'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    enquiries.value = []
  }

  return {
    loading,
    error,
    enquiries,
    getEnquiries,
    resetState,
  }
}