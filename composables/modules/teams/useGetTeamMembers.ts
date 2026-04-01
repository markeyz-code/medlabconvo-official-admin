import { ref } from 'vue'
import { teams_api, type TeamMember } from '@/api_factory/modules/teams'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetTeamMembers = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const teamMembers = ref<TeamMember[]>([])

  const getTeamMembers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await teams_api.$_get_team_members()
      if ([200, 201].includes(response?.status)) {
        teamMembers.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch team members'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    teamMembers.value = []
  }

  return {
    loading,
    error,
    teamMembers,
    getTeamMembers,
    resetState,
  }
}