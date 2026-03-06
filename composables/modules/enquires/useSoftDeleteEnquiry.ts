import { ref } from 'vue'
import { enquiries_api } from '@/api_factory/modules/enquiries'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useSoftDeleteEnquiry = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const softDeleteEnquiry = async (enquiryId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await enquiries_api.$_soft_delete_enquiry(enquiryId)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete enquiry'
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
    softDeleteEnquiry,
    resetState,
  }
}