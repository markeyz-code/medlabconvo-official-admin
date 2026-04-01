// composables/products/useBatchCreateProducts.ts
import { ref } from 'vue'
import { products_api, type CreateProductData, type Product } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useBatchCreateProducts = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const productsData = ref<Product[] | null>(null)

  const batchCreateProducts = async (productsPayload: CreateProductData[]) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await products_api.$_batch_create_products(productsPayload)
      if ([200, 201].includes(response?.status)) {
        success.value = true
        productsData.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to batch create products'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    productsData.value = null
  }

  return {
    loading,
    error,
    success,
    productsData,
    batchCreateProducts,
    resetState,
  }
}