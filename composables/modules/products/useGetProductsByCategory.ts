import { ref } from 'vue'
import { products_api, type ProductCategory, type Product } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetProductsByCategory = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const products = ref<Product[]>([])

  const getProductsByCategory = async (category: ProductCategory) => {
    loading.value = true
    error.value = null

    try {
      const response = await products_api.$_get_products_by_category(category)
      if ([200, 201].includes(response?.status)) {
      products.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch products by category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    products.value = []
  }

  return {
    loading,
    error,
    products,
    getProductsByCategory,
    resetState,
  }
}