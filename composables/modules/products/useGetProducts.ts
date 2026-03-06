// composables/products/useGetProducts.ts
import { ref } from 'vue'
import { products_api, type QueryProductParams, type Product } from '@/api_factory/modules/products'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetProducts = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<string | null>(null)
  const products = ref<Product[]>([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(1)

  const getProducts = async (queryParams?: QueryProductParams) => {
    loading.value = true
    error.value = null

    try {
      const response = await products_api.$_get_products()
      if ([200, 201].includes(response?.status)) {
      console.log(response, 'respoinsehe reeee')
      products.value = response.data.data
      filters.value = response.data.filters
      totalCount.value = response.data.totalCount || 0
      currentPage.value = response.data.currentPage || 1
      totalPages.value = response.data.totalPages || 1
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      // const response = await products_api.$_get_products(queryParams)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch products'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    products.value = []
    totalCount.value = 0
    currentPage.value = 1
    totalPages.value = 1
  }

  // onMounted(() => {
  //   getProducts()
  // })
  
  return {
    loading,
    error,
    products,
    filters,
    totalCount,
    currentPage,
    totalPages,
    getProducts,
    resetState,
  }
}
