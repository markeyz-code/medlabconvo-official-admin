import { upload_api } from '@/api_factory/core/upload'
import { ref } from 'vue'

export const useBatchUploadFile = () => {
  const loading = ref(false)
  const uploadResponse = ref([] as any[]) // Modified to store an array of responses

  const { $_batch_upload } = upload_api

  const batchUploadFile = async (files: File[]) => { // Accept an array of files
    loading.value = true
    try {
      // Create FormData and append each file
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file) // Assuming the API expects 'files' as the key
      })

      // Make the batch API call with FormData
      const res = await $_batch_upload(formData) as any
       console.log(res, 'here')
      if (res.type !== 'ERROR') {
        uploadResponse.value = res?.data ?? []
      } else {
        throw new Error('Error in API response')
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      loading.value = false
    }
  }

  return { batchUploadFile, loading, uploadResponse }
}
