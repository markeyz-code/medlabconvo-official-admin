import { ref } from 'vue'
import { forms_api, type UpdateFormData, type Form } from '@/api_factory/modules/forms'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useUpdateForm = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const formData = ref<Form | null>(null)

  const updateForm = async (formId: string, formPayload: UpdateFormData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response: any = await forms_api.$_update_form(formId, formPayload)
      if (response?.type === 'ERROR' || ![200, 201].includes(response?.status)) {
        const errorMsg = response?.data?.message || 'Failed to update form'
        error.value = Array.isArray(errorMsg) ? errorMsg.join('. ') : errorMsg
        return null
      }

      if ([200, 201].includes(response?.status)) {
        success.value = true
        formData.value = response.data
        return response.data
      }
      return null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update form'
      return null
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    formData.value = null
  }

  return {
    loading,
    error,
    success,
    formData,
    updateForm,
    resetState,
  }
}