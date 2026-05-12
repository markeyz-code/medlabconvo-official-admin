import { ref } from 'vue'
import { 
  labcast_api, 
  type SeasonData
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetSeasons = () => {
    const { showToast } = useCustomToast();
    const loading = ref(false)
    const error = ref(null)
    const seasons = ref<SeasonData[]>([])
  
    const getSeasons = async () => {
      loading.value = true
      error.value = null
  
      try {
        const response = await labcast_api.$_get_seasons()
        if ([200, 201].includes(response?.status)) {
        seasons.value = response.data
        showToast({
                  title: "Success",
                  toastType: "success",
                });
        }
        return response.data
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to fetch seasons'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    const resetState = () => {
      loading.value = false
      error.value = null
      seasons.value = []
    }
  
    return {
      loading,
      error,
      seasons,
      getSeasons,
      resetState,
    }
  }