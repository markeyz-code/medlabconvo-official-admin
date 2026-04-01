import { ref } from 'vue'
import { convostack_api } from '@/api_factory/modules/convostack'

export const useGetConvoStacks = () => {
  const loading = ref(false)
  const publications = ref([] as any[])

  const getPublications = async () => {
    loading.value = true
    try {
      const response = await convostack_api.$_get_publications()
      publications.value = response.data
    } catch (error: any) {
      console.error('Error fetching publications:', error)
    } finally {
      loading.value = false
    }
  }

  return { getPublications, publications, loading }
}
