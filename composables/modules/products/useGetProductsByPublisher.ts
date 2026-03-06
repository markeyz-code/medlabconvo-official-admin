import { ref } from 'vue'
import { products_api, type Product } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetProductsByPublisher = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const products = ref<Product[]>([])

  const getProductsByPublisher = async (publisher: string, limit?: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await products_api.$_get_products_by_publisher(publisher, limit)
      if ([200, 201].includes(response?.status)) {
      products.value = response.data.products || response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch products by publisher'
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
    getProductsByPublisher,
    resetState,
  }
}