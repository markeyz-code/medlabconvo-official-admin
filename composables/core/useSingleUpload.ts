import { upload_api } from '@/api_factory/core/upload'
import { ref } from 'vue'

export const useSingleUploadFile = () => {
  const loading = ref(false)
  const uploadResponse = ref({} as any)

  const { $_single_upload } = upload_api

  const singleUploadFile = async (file: File) => {
    loading.value = true
    try {
      // Create FormData and append the file
      const formData = new FormData()
      formData.append('file', file)

      // Make the API call with FormData
      const res = await $_single_upload(formData) as any

      if (res.type !== 'ERROR') {
        uploadResponse.value = res.data ?? {}
        return res.data
      } else {
        throw new Error('Error in API response')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      loading.value = false
    }
  }

  return { singleUploadFile, loading, uploadResponse }
}
