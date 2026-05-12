import { ref } from 'vue'
import { programs_api, type CreateProgramData, type Program } from '@/api_factory/modules/programs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useCreateProgram = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const programData = ref<Program | null>(null)

  const createProgram = async (programPayload: CreateProgramData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await programs_api.$_create_program(programPayload)
      if ([200, 201].includes(response?.status)) {
        success.value = true
        programData.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create program'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    programData.value = null
  }

  return {
    loading,
    error,
    success,
    programData,
    createProgram,
    resetState,
  }
}