import { ref, readonly } from "vue"
import { users_api, type User } from '@/api_factory/modules/users'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useSoftDeleteUser = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const softDeleteUser = async (userId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await users_api.$_soft_delete_user(userId)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      if (process.client) {
              // You can integrate with your notification system here
              console.log("User deleted successfully")
            }
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      // Show success notification
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to delete user"

      // Show error notification
      if (process.client) {
        console.error("Error deleting user:", error.value)
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    success: readonly(success),
    softDeleteUser,
    resetState,
  }
}
