import { ref } from 'vue'
import { programs_api } from '@/api_factory/modules/programs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetRegistrationLink = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const registrationLink = ref<string | null>(null)

  const getRegistrationLink = async (programId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await programs_api.$_get_registration_link(programId)
      if ([200, 201].includes(response?.status)) {
      registrationLink.value = response.data.registrationLink
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to get registration link'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    registrationLink.value = null
  }

  return {
    loading,
    error,
    registrationLink,
    getRegistrationLink,
    resetState,
  }
}