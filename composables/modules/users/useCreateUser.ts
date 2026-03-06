import { ref } from 'vue'
import { users_api, type CreateUserData, type User } from '@/api_factory/modules/users'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useCreateUser = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const userData = ref<User | null>(null)

  const createUser = async (userPayload: CreateUserData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await users_api.$_create_user(userPayload)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      userData.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create user'
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
    createUser,
    resetState,
  }
}