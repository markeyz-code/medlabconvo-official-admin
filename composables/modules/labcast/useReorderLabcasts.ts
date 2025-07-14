import { ref } from 'vue'
import { labcast_api, type LabCast} from '@/api_factory/modules/labcast'

// Define the reorder payload type to match the backend DTO
export interface LabcastPositionData {
  id: string
  position: number
}

export interface ReorderPublicationsPayload {
  labcasts: LabcastPositionData[]
}

export const useReorderLabcasts = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const reorderedLabcasts = ref<LabCast[]>([])

  const reorderPublications = async (labcastReorderPayload: ReorderPublicationsPayload) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await labcast_api.$_reorder_labcasts(labcastReorderPayload)
      success.value = true
      reorderedLabcasts.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to reorder labcasts'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper function to create reorder payload from a sorted array of labcasts
  const createReorderPayload = (sortedPublications: LabCast[]): ReorderPublicationsPayload => {
    return {
      labcasts: sortedPublications.map((pub, index) => ({
        id: pub._id || pub.id, // Handle both _id and id cases
        position: index + 1 // Start positions from 1
      }))
    }
  }

  // Convenience method to reorder from a drag-and-drop sorted array
  const reorderFromSortedArray = async (sortedPublications: LabCast[]) => {
    const payload = createReorderPayload(sortedPublications)
    return await reorderPublications(payload)
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    reorderedLabcasts.value = []
  }

  return {
    loading,
    error,
    success,
    reorderedLabcasts,
    reorderPublications,
    createReorderPayload,
    reorderFromSortedArray,
    resetState,
  }
}