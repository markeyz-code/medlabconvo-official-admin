import { ref } from 'vue'
import { programs_api, type Program } from '@/api_factory/modules/programs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetProgram = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const program = ref<Program | null>(null)

  const getProgram = async (programId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await programs_api.$_get_program(programId)
      if ([200, 201].includes(response?.status)) {
      program.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch program'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    program.value = null
  }

  return {
    loading,
    error,
    program,
    getProgram,
    resetState,
  }
}