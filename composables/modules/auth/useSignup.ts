import { ref } from 'vue'
import { auth_api, type SignupData } from '@/api_factory/modules/auth'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useSignup = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const userData = ref<any>(null)

  const signup = async (signupData: SignupData, token?: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await auth_api.$_signup(signupData, token)
      if ([200, 201].includes(response?.status)) {
        success.value = true
        userData.value = response.data
        showToast({
          title: "Success",
          message: "Account created successfully.",
          toastType: "success",
        });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Signup failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    userData.value = null
  }

  return {
    loading,
    error,
    success,
    userData,
    signup,
    resetState,
  }
}