import { ref } from 'vue'
import { 
  labcast_api, 
  type LabCast, 
  type CreateLabCastData, 
  type SeasonData,
  type PopularTag
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useBatchCreateLabCast = () => {
    const { showToast } = useCustomToast();
    const loading = ref(false)
    const error = ref(null)
    const success = ref(false)
    const labcastData = ref<LabCast[] | null>(null)
  
    const batchCreateLabCast = async (data: CreateLabCastData[]) => {
      loading.value = true
      error.value = null
      success.value = false
  
      try {
        const response = await labcast_api.$_batch_create_labcast(data)
        if ([200, 201].includes(response?.status)) {
        success.value = true
        labcastData.value = response.data
        showToast({
                  title: "Success",
                  toastType: "success",
                });
        }
        return response.data
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to batch create LabCast episodes'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    const resetState = () => {
      loading.value = false
      error.value = null
      success.value = false
      labcastData.value = null
    }
  
    return {
      loading,
      error,
      success,
      labcastData,
      batchCreateLabCast,
      resetState,
    }
  }