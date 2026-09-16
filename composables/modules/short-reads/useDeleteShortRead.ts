import { ref } from 'vue'
import { short_reads_api } from '@/api_factory/modules/short-reads'
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useDeleteShortRead = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const deleteShortRead = async (id: string) => {
    loading.value = true
    try {
      const response = await short_reads_api.$_delete_short_read(id)
      showToast({
        title: "Success",
        message: "Short read deleted successfully",
        type: "success",
      })
      return response.data
    } catch (err: any) {
      showToast({
        title: "Error",
        message: err.response?.data?.message || 'Failed to delete short read',
        type: "error",
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, deleteShortRead }
}
