import { ref } from 'vue'
import { products_api, type FilterOptions } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetProductFilters = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<FilterOptions | null>(null)

  const getFilters = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await products_api.$_get_filters()
      if ([200, 201].includes(response?.status)) {
      filters.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch product filters'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    filters.value = null
  }

  return {
    loading,
    error,
    filters,
    getFilters,
    resetState,
  }
}