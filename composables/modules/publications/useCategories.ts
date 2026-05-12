import { ref } from 'vue'
import { publications_api } from '@/api_factory/modules/publications'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCategories = () => {
  const categories = ref<any[]>([])
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const getCategories = async () => {
    loading.value = true
    try {
      const res = await (publications_api as any).$_get_categories()
      categories.value = res.data || []
    } catch (e) {
      console.error('Failed to fetch categories:', e)
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (payload: { name: string; description?: string }) => {
    loading.value = true
    try {
      const res = await (publications_api as any).$_create_category(payload)
      categories.value.push(res.data)
      showToast({ title: 'Success', message: 'Category created successfully', toastType: 'success' })
      return res.data
    } catch (e: any) {
      showToast({ title: 'Error', message: e.response?.data?.message || 'Failed to create category', toastType: 'error' })
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: string) => {
    loading.value = true
    try {
      await (publications_api as any).$_delete_category(id)
      categories.value = categories.value.filter(c => c._id !== id)
      showToast({ title: 'Success', message: 'Category deleted successfully', toastType: 'success' })
    } catch (e) {
      showToast({ title: 'Error', message: 'Failed to delete category', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: string, payload: { name?: string; description?: string }) => {
    loading.value = true
    try {
      const res = await (publications_api as any).$_update_category(id, payload)
      const index = categories.value.findIndex(c => c._id === id)
      if (index !== -1) {
        categories.value[index] = res.data
      }
      showToast({ title: 'Success', message: 'Category updated successfully', toastType: 'success' })
      return res.data
    } catch (e: any) {
      showToast({ title: 'Error', message: e.response?.data?.message || 'Failed to update category', toastType: 'error' })
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
