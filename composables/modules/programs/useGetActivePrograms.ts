import { ref } from 'vue'
import { programs_api, type Program } from '@/api_factory/modules/programs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetActivePrograms = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const programs = ref<Program[]>([])

  const getActivePrograms = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await programs_api.$_get_active_programs()
      if ([200, 201].includes(response?.status)) {
      programs.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch active programs'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    programs.value = []
  }

  return {
    loading,
    error,
    programs,
    getActivePrograms,
    resetState,
  }
}