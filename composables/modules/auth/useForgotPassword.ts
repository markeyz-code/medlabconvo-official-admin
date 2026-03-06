import { ref } from "vue"
import { auth_api, type ForgotPasswordPayload } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useForgotPassword = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const responseData = ref<any>(null)

  const forgotPassword = async (payload: ForgotPasswordPayload) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await auth_api.$_forgot_password(payload)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      responseData.value = response.data.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Password reset request failed"
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    responseData.value = null
  }

  return {
    loading,
    error,
    success,
    responseData,
    forgotPassword,
    resetState,
  }
}
