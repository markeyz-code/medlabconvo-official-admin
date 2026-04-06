import { ref } from 'vue'
import { 
  labcast_api, 
  type PopularTag
} from '@/api_factory/modules/labcast'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetPopularTags = () => {
    const { showToast } = useCustomToast();
    const loading = ref(false)
    const error = ref(null)
    const tags = ref<PopularTag[]>([])
  
    const getPopularTags = async () => {
      loading.value = true
      error.value = null
  
      try {
        const response = await labcast_api.$_get_popular_tags()
        if ([200, 201].includes(response?.status)) {
        console.log(response, 'taggsss')
        tags.value = response.data
        // showToast({
        //           title: "Success",
        //           toastType: "success",
        //         });
        }
        return response.data
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to fetch popular tags'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    const resetState = () => {
      loading.value = false
      error.value = null
      tags.value = []
    }
  
    return {
      loading,
      error,
      tags,
      getPopularTags,
      resetState,
    }
  }