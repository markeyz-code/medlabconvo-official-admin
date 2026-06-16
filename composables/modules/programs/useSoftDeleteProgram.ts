import { ref } from 'vue'
import { programs_api } from '@/api_factory/modules/programs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useSoftDeleteProgram = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const softDeleteProgram = async (programId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await programs_api.$_soft_delete_program(programId)
      if ([200, 201].includes(response?.status)) {
        success.value = true

      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete program'
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
    softDeleteProgram,
    resetState,
  }
}