import { ref } from 'vue'
import { programs_api, type Program, type ProgramQueryParams } from '@/api_factory/modules/programs'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetPrograms = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const programs = ref<Program[]>([])
  
  // Pagination State
  const metadata = ref({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  })
  
  // Filter State
  const filters = ref({
    search: '',
    status: '',
    category: ''
  })

  const getPrograms = async (params?: ProgramQueryParams) => {
    loading.value = true
    error.value = null

    const mergedParams = {
      page: metadata.value.page,
      limit: metadata.value.limit,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.status && { status: filters.value.status }),
      ...(filters.value.category && { category: filters.value.category }),
      ...params
    }

    try {
      const response = await programs_api.$_get_programs(mergedParams)
      if ([200, 201].includes(response?.status)) {
        // Handle new paginated response structure or fallback to array if older response
        if (response.data?.data && response.data?.metadata) {
          programs.value = response.data.data
          metadata.value = response.data.metadata
        } else if (Array.isArray(response.data)) {
          programs.value = response.data
        }
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch programs'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const setPage = (page: number) => {
    if (page >= 1 && page <= metadata.value.pages) {
      metadata.value.page = page
      getPrograms()
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    programs.value = []
    metadata.value = { total: 0, page: 1, limit: 10, pages: 1 }
    filters.value = { search: '', status: '', category: '' }
  }

  return {
    loading,
    error,
    programs,
    metadata,
    filters,
    getPrograms,
    setPage,
    resetState,
  }
}