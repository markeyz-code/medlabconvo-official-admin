import { ref } from 'vue'
import { short_reads_api, type UpdateShortReadData } from '@/api_factory/modules/short-reads'
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useUpdateShortRead = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const updateShortRead = async (id: string, data: UpdateShortReadData) => {
    loading.value = true
    try {
      const response = await short_reads_api.$_update_short_read(id, data)
      showToast({
        title: "Success",
        message: "Short read updated successfully",
        type: "success",
      })
      return response.data
    } catch (err: any) {
      showToast({
        title: "Error",
        message: err.response?.data?.message || 'Failed to update short read',
        type: "error",
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, updateShortRead }
}
