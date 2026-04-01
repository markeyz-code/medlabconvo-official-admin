import { ref } from 'vue'
import { products_api } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useDeleteProduct = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const deleteProduct = async (productId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await products_api.$_delete_product(productId)
      if ([200, 201].includes(response?.status)) {
        success.value = true

      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete product'
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
    deleteProduct,
    resetState,
  }
}