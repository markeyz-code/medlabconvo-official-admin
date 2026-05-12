import { ref } from 'vue'
import { convostack_api } from '@/api_factory/modules/convostack'

export const useGetConvoStackComments = () => {
  const loading = ref(false)
  const comments = ref([] as any[])

  const getComments = async (publicationId: string) => {
    loading.value = true
    try {
      const response = await convostack_api.$_get_comments(publicationId)
      comments.value = response.data
    } catch (error: any) {
      console.error('Error fetching comments:', error)
    } finally {
      loading.value = false
    }
  }

  return { getComments, comments, loading }
}
