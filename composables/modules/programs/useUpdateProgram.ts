import { ref } from 'vue'
import { programs_api, type UpdateProgramData, type Program } from '@/api_factory/modules/programs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useUpdateProgram = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const programData = ref<Program | null>(null)

  const updateProgram = async (programId: string, programPayload: UpdateProgramData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await programs_api.$_update_program(programId, programPayload)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      programData.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update program'
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
    updateProgram,
    resetState,
  }
}