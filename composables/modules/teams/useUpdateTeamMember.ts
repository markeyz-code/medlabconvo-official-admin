import { ref } from 'vue'
import { teams_api, type UpdateTeamMemberData, type TeamMember } from '@/api_factory/modules/teams'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useUpdateTeamMember = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const teamMemberData = ref<TeamMember | null>(null)

  const updateTeamMember = async (memberId: string, memberPayload: UpdateTeamMemberData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await teams_api.$_update_team_member(memberId, memberPayload)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      teamMemberData.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update team member'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    teamMemberData.value = null
  }

  return {
    loading,
    error,
    success,
    teamMemberData,
    updateTeamMember,
    resetState,
  }
}