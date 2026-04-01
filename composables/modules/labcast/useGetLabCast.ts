import { ref } from 'vue'
import { 
  labcast_api, 
  type LabCast
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetLabCast = () => {
    const { showToast } = useCustomToast();
    const loading = ref(false)
    const error = ref(null)
    const labcast = ref<LabCast | null>(null)
  
    const getLabCast = async (labcastId: string) => {
      loading.value = true
      error.value = null
  
      try {
        const response = await labcast_api.$_get_labcast(labcastId)
        if ([200, 201].includes(response?.status)) {
        labcast.value = response.data
        showToast({
                  title: "Success",
                  toastType: "success",
                });
        }
        return response.data
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to fetch LabCast episode'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    const resetState = () => {
      loading.value = false
      error.value = null
      labcast.value = null
    }
  
    return {
      loading,
      error,
      labcast,
      getLabCast,
      resetState,
    }
  }
  