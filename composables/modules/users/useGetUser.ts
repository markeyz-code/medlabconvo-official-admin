import { ref, readonly } from "vue"
import { users_api, type User } from "@/api_factory/modules/users"
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetUser = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const userData = ref<User | null>(null)

  const getUser = async (userId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await users_api.$_get_user(userId)
      if ([200, 201].includes(response?.status)) {
        success.value = true
        userData.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch user"
      console.error("Get user error:", err)
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
    loading: readonly(loading),
    error: readonly(error),
    success: readonly(success),
    userData: readonly(userData),
    getUser,
    resetState,
  }
}
