import { ref } from 'vue'
import { users_api, type User } from '@/api_factory/modules/users'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetUsers = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const users = ref<User[]>([])

  const getUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await users_api.$_get_users()
      if ([200, 201].includes(response?.status)) {
      users.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch users'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    users.value = []
  }

  return {
    loading,
    error,
    users,
    getUsers,
    resetState,
  }
}