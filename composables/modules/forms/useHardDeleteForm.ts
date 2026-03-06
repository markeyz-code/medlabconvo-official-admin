import { ref } from 'vue'
import { forms_api } from '@/api_factory/modules/forms'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useHardDeleteForm = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const hardDeleteForm = async (formId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await forms_api.$_hard_delete_form(formId)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to permanently delete form'
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
    hardDeleteForm,
    resetState,
  }
}