import { ref } from 'vue'
import { products_api, type Product } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetBestSellers = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const bestSellers = ref<Product[]>([])

  const getBestSellers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await products_api.$_get_best_sellers()
      if ([200, 201].includes(response?.status)) {
        bestSellers.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch best sellers'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    bestSellers.value = []
  }

  return {
    loading,
    error,
    bestSellers,
    getBestSellers,
    resetState,
  }
}