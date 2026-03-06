// composables/products/useGetProductsOnSale.ts
import { ref } from 'vue'
import { products_api, type Product } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetProductsOnSale = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const productsOnSale = ref<Product[]>([])

  const getProductsOnSale = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await products_api.$_get_products_on_sale()
      if ([200, 201].includes(response?.status)) {
      productsOnSale.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch products on sale'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    productsOnSale.value = []
  }

  return {
    loading,
    error,
    productsOnSale,
    getProductsOnSale,
    resetState,
  }
}
