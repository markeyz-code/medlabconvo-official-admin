import { ref } from 'vue'
import { blogs_api, type Blog } from '@/api_factory/modules/blogs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const usePublishBlog = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const blogData = ref<Blog | null>(null)

  const publishBlog = async (blogId: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await blogs_api.$_publish_blog(blogId)
      if ([200, 201].includes(response?.status)) {
        success.value = true
        blogData.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to publish blog'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    blogData.value = null
  }

  return {
    loading,
    error,
    success,
    blogData,
    publishBlog,
    resetState,
  }
}