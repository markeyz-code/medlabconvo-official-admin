import { ref } from 'vue'
import { 
  labcast_api, 
  type LabCast, 
  type CreateLabCastData, 
  type UpdateLabCastData,
  type QueryLabCastParams,
  type LabCastStats,
  type SeasonData,
  type PopularTag
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast"


export const useCreateLabCast = () => {
    const loading = ref(false)
    const error = ref(null)
    const success = ref(false)
    const labcastData = ref<LabCast | null>(null)
    const { showToast } = useCustomToast()
  
    const createLabCast = async (data: CreateLabCastData) => {
      loading.value = true
      error.value = null
      success.value = false
  
      try {
        const response = await labcast_api.$_create_labcast(data)
        success.value = true
        labcastData.value = response.data
        showToast({
          title: "Success",
          message: "Labcast Created Successfully!!!",
          toastType: "success",
        })
        return response.data
      } catch (err: any) {
        showToast({
          title: "Error",
          message: err.response?.data?.message || 'Failed to create LabCast episode',
          toastType: "error",
        })
        error.value = err.response?.data?.message || 'Failed to create LabCast episode'
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
      createLabCast,
      resetState,
    }
  }