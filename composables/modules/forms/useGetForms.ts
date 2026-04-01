import { ref } from 'vue'
import { forms_api, type Form } from '@/api_factory/modules/forms'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetForms = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const forms = ref<Form[]>([])

  const getForms = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await forms_api.$_get_forms()
      if ([200, 201].includes(response?.status)) {
        forms.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch forms'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    forms.value = []
  }

  return {
    loading,
    error,
    forms,
    getForms,
    resetState,
  }
}