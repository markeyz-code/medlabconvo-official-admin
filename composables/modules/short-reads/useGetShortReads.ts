import { ref } from 'vue'
import { short_reads_api, type ShortRead, type ShortReadQueryParams } from '@/api_factory/modules/short-reads'

export const useGetShortReads = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const shortReads = ref<ShortRead[]>([])

  const getShortReads = async (params?: ShortReadQueryParams) => {
    loading.value = true
    error.value = null

    try {
      const response = await short_reads_api.$_get_short_reads(params)
      if ([200, 201].includes(response?.status)) {
        shortReads.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch short reads'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, error, shortReads, getShortReads }
}
