import { ref } from 'vue'
import { products_api, type Product } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetDigitalProducts = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const digitalProducts = ref<Product[]>([])

  const getDigitalProducts = async (limit?: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await products_api.$_get_digital_products(limit)
      if ([200, 201].includes(response?.status)) {
      digitalProducts.value = response.data.products || response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch digital products'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    digitalProducts.value = []
  }

  return {
    loading,
    error,
    digitalProducts,
    getDigitalProducts,
    resetState,
  }
}