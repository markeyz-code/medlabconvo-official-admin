import { ref } from "vue"
import { auth_api, type ResetPasswordPayload } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useResetPassword = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const responseData = ref<any>(null)

  const resetPassword = async (token: string, payload: ResetPasswordPayload) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await auth_api.$_reset_password(token, payload)
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
      error.value = err.response?.data?.message || "Password reset failed"
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
    resetPassword,
    resetState,
  }
}
