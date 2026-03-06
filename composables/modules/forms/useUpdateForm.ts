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
      const response = await forms_api.$_update_form(formId, formPayload)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      formData.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update form'
      throw err
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