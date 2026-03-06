import { ref } from 'vue'
import { teams_api } from '@/api_factory/modules/teams'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useSoftDeleteTeamMember = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const softDeleteTeamMember = async (memberId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await teams_api.$_soft_delete_team_member(memberId)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete team member'
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
    softDeleteTeamMember,
    resetState,
  }
}