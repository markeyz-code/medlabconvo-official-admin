import { ref } from 'vue'
import { 
  labcast_api, 
  type LabCast, 
  type QueryLabCastParams
} from '@/api_factory/modules/labcast'


export const useGetLabCasts = () => {
  const loading = ref(false)
  const error = ref(null)
  const labcasts = ref<LabCast[]>([])
  const totalCount = ref(0)
  const currentPage = ref(1)

  const getLabCasts = async (queryParams?: QueryLabCastParams) => {
    loading.value = true
    error.value = null

    try {
      // const response = await labcast_api.$_get_labcasts(queryParams)
      const response = await labcast_api.$_get_labcasts()
      labcasts.value = response.data.data || response.data
      totalCount.value = response.data.total || response.data.length
      currentPage.value = queryParams?.page || 1
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch LabCast episodes'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    labcasts.value = []
    totalCount.value = 0
    currentPage.value = 1
  }

  onMounted(() => {
    console.log('Hello world')
    getLabCasts()
  })

  return {
    loading,
    error,
    labcasts,
    totalCount,
    currentPage,
    getLabCasts,
    resetState,
  }
}