import { ref } from 'vue'
import { auth_api, type LoginCredentials, type AuthResponse } from '@/api_factory/modules/auth'
import { useUser } from "@/composables/modules/auth/user"
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useLogin = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const authData = ref<AuthResponse | null>(null)
  const { createUser } = useUser()

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await auth_api.$_login(credentials)
      if ([200, 201].includes(response?.status)) {
        console.log(response, 'login res')
        success.value = true
        authData.value = response.data
        createUser(response.data)

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    authData.value = null
  }

  return {
    loading,
    error,
    success,
    authData,
    login,
    resetState,
  }
}