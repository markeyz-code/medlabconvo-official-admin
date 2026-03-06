import { ref } from 'vue'
import { blogs_api, type Blog } from '@/api_factory/modules/blogs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetPublishedBlogs = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const blogs = ref<Blog[]>([])

  const getPublishedBlogs = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await blogs_api.$_get_published_blogs()
      if ([200, 201].includes(response?.status)) {
      blogs.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch published blogs'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    blogs.value = []
  }

  return {
    loading,
    error,
    blogs,
    getPublishedBlogs,
    resetState,
  }
}