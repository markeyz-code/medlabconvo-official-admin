import { ref } from 'vue'
import { 
  labcast_api, 
  type LabCast,
  type UpdateLabCastData,
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast"


// Update LabCast episode
export const useUpdateLabCast = () => {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const labcast = ref<LabCast | null>(null)
  const { showToast } = useCustomToast()

  const updateLabCast = async (labcastId: string, updateData: UpdateLabCastData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await labcast_api.$_update_labcast(labcastId, updateData)
      success.value = true
      labcast.value = response.data
      showToast({
        title: "Success",
        message: "Labcast Updated Successfully!!!",
        toastType: "success",
      })
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update LabCast episode'
      showToast({
        title: "Error",
        message:err.response?.data?.message || 'Failed to update LabCast episode',
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
    labcast.value = null
  }

  return {
    loading,
    error,
    success,
    labcast,
    updateLabCast,
    resetState,
  }
}
