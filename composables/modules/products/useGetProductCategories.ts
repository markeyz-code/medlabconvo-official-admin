import { ref } from 'vue'
import { products_api, type CategoryData } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetProductCategories = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const categories = ref<CategoryData[]>([])

  const getCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await products_api.$_get_categories()
      if ([200, 201].includes(response?.status)) {
        categories.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch product categories'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    categories.value = []
  }

  return {
    loading,
    error,
    categories,
    getCategories,
    resetState,
  }
}