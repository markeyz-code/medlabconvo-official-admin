import { ref } from 'vue'
import { 
  labcast_api, 
  type LabCast
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetEpisodesByTags = () => {
    const { showToast } = useCustomToast();
    const loading = ref(false)
    const error = ref(null)
    const episodes = ref<LabCast[]>([])
  
    const getEpisodesByTags = async (tags: string[]) => {
      loading.value = true
      error.value = null
  
      try {
        const response = await labcast_api.$_get_episodes_by_tags(tags)
        if ([200, 201].includes(response?.status)) {
        episodes.value = response.data.data || response.data
        // showToast({
        //           title: "Success",
        //           toastType: "success",
        //         });
        }
        return response.data
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to fetch episodes by tags'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    const resetState = () => {
      loading.value = false
      error.value = null
      episodes.value = []
    }
  
    return {
      loading,
      error,
      episodes,
      getEpisodesByTags,
      resetState,
    }
  }