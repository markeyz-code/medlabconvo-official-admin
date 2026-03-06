import { ref } from 'vue'
import { teams_api, type TeamMember } from '@/api_factory/modules/teams'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetTeamMember = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const teamMember = ref<TeamMember | null>(null)

  const getTeamMember = async (memberId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await teams_api.$_get_team_member(memberId)
      if ([200, 201].includes(response?.status)) {
      teamMember.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch team member'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    teamMember.value = null
  }

  return {
    loading,
    error,
    teamMember,
    getTeamMember,
    resetState,
  }
}