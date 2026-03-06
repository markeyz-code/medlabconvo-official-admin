import { ref } from 'vue'
import { blogs_api, type Blog } from '@/api_factory/modules/blogs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetBlog = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const blog = ref<Blog | null>(null)

  const getBlog = async (blogId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await blogs_api.$_get_blog(blogId)
      if ([200, 201].includes(response?.status)) {
      blog.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch blog'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    blog.value = null
  }

  return {
    loading,
    error,
    blog,
    getBlog,
    resetState,
  }
}