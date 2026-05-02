import { ref } from 'vue'
import { programs_api, type Program } from '@/api_factory/modules/programs'

export interface ProgramPositionData {
  id: string
  position: number
}

export interface ReorderProgramsPayload {
  programs: ProgramPositionData[]
}

export const useReorderPrograms = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const reorderPrograms = async (payload: ReorderProgramsPayload) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await programs_api.$_reorder_programs(payload)
      if ([200, 201].includes(response?.status)) {
        success.value = true
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to reorder programs'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createReorderPayload = (sortedPrograms: any[]): ReorderProgramsPayload => {
    return {
      programs: sortedPrograms.map((prog, index) => ({
        id: prog._id || prog.id,
        position: index + 1
      }))
    }
  }

  const reorderFromSortedArray = async (sortedPrograms: any[]) => {
    const payload = createReorderPayload(sortedPrograms)
    return await reorderPrograms(payload)
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
    reorderPrograms,
    reorderFromSortedArray,
    resetState,
  }
}
