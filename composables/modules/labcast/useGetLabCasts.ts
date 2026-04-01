import { ref, onMounted } from 'vue'
import { 
  labcast_api, 
  type LabCast, 
  type QueryLabCastParams
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetLabCasts = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref(null)
  const labcasts = ref<LabCast[]>([])
  const totalCount = ref(0)
  const currentPage = ref(1)

  const getLabCasts = async (queryParams?: QueryLabCastParams) => {
    loading.value = true
    error.value = null

    try {
      const response = await labcast_api.$_get_labcasts(queryParams)
      if ([200, 201].includes(response?.status)) {
        labcasts.value = response.data.data || response.data
        totalCount.value = response.data.total || response.data.length
        currentPage.value = queryParams?.page || 1
        showToast({
          title: "Success",
          toastType: "success",
        });
      }
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