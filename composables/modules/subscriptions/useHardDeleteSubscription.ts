import { ref } from 'vue'
import { subscriptions_api } from '@/api_factory/modules/subscriptions'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useHardDeleteSubscription = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const hardDeleteSubscription = async (subscriptionId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await subscriptions_api.$_hard_delete_subscription(subscriptionId)
      if ([200, 201].includes(response?.status)) {
        success.value = true

      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to permanently delete subscription'
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
    loading,
    error,
    success,
    hardDeleteSubscription,
    resetState,
  }
}