import { ref } from 'vue'
import { teams_api, type CreateTeamMemberData, type TeamMember } from '@/api_factory/modules/teams'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useCreateTeamMember = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const teamMemberData = ref<TeamMember | null>(null)

  const createTeamMember = async (memberPayload: CreateTeamMemberData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await teams_api.$_create_member(memberPayload)
      if ([200, 201].includes(response?.status)) {
        success.value = true
        teamMemberData.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create team member'
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
    createTeamMember,
    resetState,
  }
}