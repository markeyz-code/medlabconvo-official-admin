// composables/products/useCreateProduct.ts
import { ref } from 'vue'
import { products_api, type CreateProductData, type Product } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useCreateProduct = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const productData = ref<Product | null>(null)

  const createProduct = async (productPayload: CreateProductData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await products_api.$_create_product(productPayload)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      productData.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    productData.value = null
  }

  return {
    loading,
    error,
    success,
    productData,
    createProduct,
    resetState,
  }
}