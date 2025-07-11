// import { ref } from 'vue'
// import { publications_api, type UpdatePublicationData, type Publication } from '@/api_factory/modules/publications'

// export const useReorderPublication = () => {
//   const loading = ref(false)
//   const error = ref<string | null>(null)
//   const success = ref(false)
//   const publicationData = ref<Publication | null>(null)

//   const reorderPublication = async (publicationReorderPayload: UpdatePublicationData) => {
//     loading.value = true
//     error.value = null
//     success.value = false

//     try {
//       const response = await publications_api.$_reorder_publication(publicationReorderPayload)
//       success.value = true
//       publicationData.value = response.data
//       return response.data
//     } catch (err: any) {
//       error.value = err.response?.data?.message || 'Failed to update publication'
//       throw err
//     } finally {
//       loading.value = false
//     }
//   }

//   const resetState = () => {
//     loading.value = false
//     error.value = null
//     success.value = false
//     publicationData.value = null
//   }

//   return {
//     loading,
//     error,
//     success,
//     publicationData,
//     reorderPublication,
//     resetState,
//   }
// }

import { ref } from 'vue'
import { publications_api, type Publication } from '@/api_factory/modules/publications'

// Define the reorder payload type to match the backend DTO
export interface PublicationPositionData {
  id: string
  position: number
}

export interface ReorderPublicationsPayload {
  publications: PublicationPositionData[]
}

export const useReorderPublication = () => {
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
      success.value = true
      reorderedPublications.value = response.data
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