import { ref } from 'vue'
import { cms_api, type CmsDocument } from '@/api_factory/modules/cms'

export const useGetCms = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const cmsPages = ref<CmsDocument[]>([])
  const singleCms = ref<CmsDocument | null>(null)

  const getAllCms = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await cms_api.$_get_all_cms()
      cmsPages.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch CMS pages'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCmsByKey = async (key: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await cms_api.$_get_cms_by_key(key)
      singleCms.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch CMS data'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    cmsPages,
    singleCms,
    getAllCms,
    getCmsByKey
  }
}
