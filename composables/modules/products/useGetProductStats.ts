import { ref } from 'vue'
import { products_api, type ProductStats } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetProductStats = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const stats = ref<ProductStats | null>(null)

  const getStats = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await products_api.$_get_stats()
      if ([200, 201].includes(response?.status)) {
        stats.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch product statistics'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    stats.value = null
  }

  return {
    loading,
    error,
    stats,
    getStats,
    resetState,
  }
}
