import { ref } from 'vue'

export const useUploadFile = () => {
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uploadError = ref<string | null>(null)

  /**
   * Upload multiple files and return their URLs
   * @param files Array of files to upload
   * @returns Promise resolving to array of uploaded file URLs
   */
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (!files.length) return []
    
    uploading.value = true
    uploadProgress.value = 0
    uploadError.value = null
    
    try {
      // Create a FormData instance for each file
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        // You would typically have an API endpoint for file uploads
        // This is a placeholder for your actual upload implementation
        // const response = await axios.post('/api/upload', formData, {
        //   onUploadProgress: (progressEvent) => {
        //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        //     uploadProgress.value = percentCompleted
        //   }
        // })
        
        // For demonstration, we'll simulate an upload and return a placeholder URL
        await new Promise(resolve => setTimeout(resolve, 1000))
        uploadProgress.value += (100 / files.length)
        
        // In a real implementation, you would return the URL from your server
        return `https://example.com/uploads/${file.name}`
      })
      
      const uploadedUrls = await Promise.all(uploadPromises)
      uploadProgress.value = 100
      return uploadedUrls
    } catch (e: any) {
      uploadError.value = e.message || 'Failed to upload files'
      throw uploadError.value
    } finally {
      uploading.value = false
    }
  }

  /**
   * Upload a single file and return its URL
   * @param file File to upload
   * @returns Promise resolving to uploaded file URL
   */
  const uploadFile = async (file: File): Promise<string> => {
    const urls = await uploadFiles([file])
    return urls[0]
  }

  return {
    uploading,
    uploadProgress,
    uploadError,
    uploadFiles,
    uploadFile
  }
}