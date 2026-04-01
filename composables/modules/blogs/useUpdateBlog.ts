import { ref } from 'vue'
import { blogs_api, type UpdateBlogData, type Blog } from '@/api_factory/modules/blogs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useUpdateBlog = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const blogData = ref<Blog | null>(null)

  const updateBlog = async (blogId: string, blogPayload: UpdateBlogData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await blogs_api.$_update_blog(blogId, blogPayload)
      if ([200, 201].includes(response?.status)) {
        success.value = true
        blogData.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update blog'
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
    updateBlog,
    resetState,
  }
}