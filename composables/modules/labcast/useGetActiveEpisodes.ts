import { ref } from 'vue'
import { 
  labcast_api, 
  type LabCast, 
  type QueryLabCastParams
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetActiveEpisodes = () => {
    const { showToast } = useCustomToast();
    const loading = ref(false)
    const error = ref(null)
    const episodes = ref<LabCast[]>([])
    const totalCount = ref(0)
  
    const getActiveEpisodes = async (queryParams?: QueryLabCastParams) => {
      loading.value = true
      error.value = null
  
      try {
        const response = await labcast_api.$_get_active_episodes(queryParams)
        if ([200, 201].includes(response?.status)) {
        episodes.value = response.data.data || response.data
        totalCount.value = response.data.total || response.data.length
        // showToast({
        //           title: "Success",
        //           toastType: "success",
        //         });
        }
        return response.data
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to fetch active episodes'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    const resetState = () => {
      loading.value = false
      error.value = null
      episodes.value = []
      totalCount.value = 0
    }
  
    return {
      loading,
      error,
      episodes,
      totalCount,
      getActiveEpisodes,
      resetState,
    }
  }