import { ref } from 'vue'
import { short_reads_api, type CreateShortReadData } from '@/api_factory/modules/short-reads'
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useCreateShortRead = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const createShortRead = async (data: CreateShortReadData) => {
    loading.value = true
    try {
      const response = await short_reads_api.$_create_short_read(data)
      showToast({
        title: "Success",
        message: "Short read created successfully",
        type: "success",
      })
      return response.data
    } catch (err: any) {
      showToast({
        title: "Error",
        message: err.response?.data?.message || 'Failed to create short read',
        type: "error",
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, createShortRead }
}
