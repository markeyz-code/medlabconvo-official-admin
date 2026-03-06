import { ref } from 'vue'
import { publications_api, type Publication } from '@/api_factory/modules/publications'
import { useCustomToast } from "@/composables/core/useCustomToast";

// Define the reorder payload type to match the backend DTO
export interface PublicationPositionData {
  id: string
  position: number
}

export interface ReorderPublicationsPayload {
  publications: PublicationPositionData[]
}

export const useReorderPublication = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const reorderedPublications = ref<Publication[]>([])

  const reorderPublications = async (publicationReorderPayload: ReorderPublicationsPayload) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await publications_api.$_reorder_publication(publicationReorderPayload)
      if ([200, 201].includes(response?.status)) {
      success.value = true
      reorderedPublications.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to reorder publications'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper function to create reorder payload from a sorted array of publications
  const createReorderPayload = (sortedPublications: Publication[]): ReorderPublicationsPayload => {
    return {
      publications: sortedPublications.map((pub, index) => ({
        id: pub._id || pub.id, // Handle both _id and id cases
        position: index + 1 // Start positions from 1
      }))
    }
  }

  // Convenience method to reorder from a drag-and-drop sorted array
  const reorderFromSortedArray = async (sortedPublications: Publication[]) => {
    const payload = createReorderPayload(sortedPublications)
    return await reorderPublications(payload)
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    reorderedPublications.value = []
  }

  return {
    loading,
    error,
    success,
    reorderedPublications,
    reorderPublications,
    createReorderPayload,
    reorderFromSortedArray,
    resetState,
  }
}