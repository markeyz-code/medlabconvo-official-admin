import { ref } from 'vue'
import { forms_api, type FormSubmission } from '@/api_factory/modules/forms'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetFormSubmissions = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const submissions = ref<FormSubmission[]>([])

  const getFormSubmissions = async (formId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await forms_api.$_get_form_submissions(formId)
      if ([200, 201].includes(response?.status)) {
        submissions.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch form submissions'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    submissions.value = []
  }

  return {
    loading,
    error,
    submissions,
    getFormSubmissions,
    resetState,
  }
}