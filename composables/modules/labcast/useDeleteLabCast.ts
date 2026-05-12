
import { ref } from 'vue'
import { 
  labcast_api, 
  type LabCast
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useDeleteLabCast = () => {
    const loading = ref(false)
    const error = ref(null)
    const success = ref(false)
    const { showToast } = useCustomToast()
  
    const deleteLabCast = async (labcastId: string) => {
      loading.value = true
      error.value = null
      success.value = false
  
      try {
        const response = await labcast_api.$_delete_labcast(labcastId)
        showToast({
          title: "Success",
          message: "Labcast was deleted Successfully!!!",
          toastType: "success",
        })
        success.value = true
        return response.data
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to delete LabCast episode'
        showToast({
          title: "Error",
          message: err.response?.data?.message || 'Failed to delete LabCast episode',
          toastType: "error",
        })
        throw err
      } finally {
        loading.value = false
      }
    }
  
    const resetState = () => {
      loading.value = false
      error.value = null
      success.value = false
    }
  
    return {
      loading,
      error,
      success,
      deleteLabCast,
      resetState,
    }
  }