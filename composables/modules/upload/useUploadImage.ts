import { ref } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export const useUploadImage = () => {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  const uploadImage = async (file: File) => {
    uploading.value = true
    error.value = null
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // Use the images endpoint as found in backend/src/images/images.controller.ts
      const response = await GATEWAY_ENDPOINT.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Upload failed'
      throw e
    } finally {
      uploading.value = false
    }
  }

  return {
    uploadImage,
    uploading,
    error
  }
}
