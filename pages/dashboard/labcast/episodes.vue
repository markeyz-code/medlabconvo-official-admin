<template>
    <div>
      <LabcastAdminHeader 
        title="Episodes" 
        subtitle="Manage your LabCast episodes"
      >
        <template #actions>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
            Add Episode
          </button>
        </template>
      </LabcastAdminHeader>
  
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div class="relative">
              <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                v-model="searchQuery"
                type="text"
               
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="debouncedSearch"
              />
            </div>
          </div>
  
          <!-- Season Filter -->
          <div class="w-full">
            <SelectInput
              v-model="selectedSeason"
              label="Season"
              :options="[{ label: 'All Seasons', value: '' }].concat(seasons?.map(s => ({ label: `Season ${s.season} (${s.episodeCount} episodes)`, value: s.season })) || [])"
              @update:modelValue="applyFilters"
            />
          </div>
  
          <!-- Status Filter -->
          <div class="w-full">
            <SelectInput
              v-model="selectedStatus"
              label="Status"
              :options="[
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'true' },
                { label: 'Inactive', value: 'false' }
              ]"
              @update:modelValue="applyFilters"
            />
          </div>
  
          <!-- Sort -->
          <div class="w-full">
            <SelectInput
              v-model="sortBy"
              label="Sort By"
              :options="[
                { label: 'Latest First', value: 'publishedAt:desc' },
                { label: 'Oldest First', value: 'publishedAt:asc' },
                { label: 'Title A-Z', value: 'title:asc' },
                { label: 'Title Z-A', value: 'title:desc' },
                { label: 'Season (High-Low)', value: 'season:desc' },
                { label: 'Episode (High-Low)', value: 'episode:desc' }
              ]"
              @update:modelValue="applyFilters"
            />
          </div>
        </div>
      </div>
  
      <!-- Episodes List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div v-if="labcastsLoading" class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="animate-pulse">
              <div class="flex space-x-4">
                <div class="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div v-else-if="currentEpisodes?.length" class="divide-y divide-gray-200">
          <LabcastEpisodeCard
            v-for="episode in currentEpisodes"
            :key="episode._id"
            :episode="episode"
            @edit="editEpisode"
            @delete="deleteEpisode"
            @toggle-status="toggleEpisodeStatus"
          />
        </div>
  
        <div v-else class="p-12 text-center">
          <Icon name="lucide:podcast" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No episodes found</h3>
          <p class="text-gray-900 mb-6">Get started by creating your first episode.</p>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
            Add Episode
          </button>
        </div>
      </div>
  
      <!-- Pagination -->
      <LabcastPagination
        v-if="currentEpisodes?.length"
        :current-page="labcastsCurrentPage"
        :total-count="labcastsTotalCount"
        :per-page="perPage"
        @page-change="changePage"
        class="mt-6"
      />
  
      <!-- Create/Edit Modal -->
      <LabcastEpisodeModal
        v-model="showCreateModal"
        :episode="editingEpisode"
        @saved="handleEpisodeSaved"
      />
  
      <!-- Delete Confirmation Modal -->
      <LabcastConfirmModal
        v-model="showDeleteModal"
        title="Delete Episode"
        :message="`Are you sure you want to delete '${deletingEpisode?.title}'? This action cannot be undone.`"
        confirm-text="Delete"
        confirm-class="bg-red-600 hover:bg-red-700"
        @confirm="confirmDelete"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import type { LabCast } from '@/types/labcast'
  import { ref, computed, onMounted } from 'vue'
  import { useDebounceFn } from '@vueuse/core'
  import { useGetLabCasts } from "@/composables/modules/labcast/useGetLabCasts"
  import { useGetSeasons } from "@/composables/modules/labcast/useGetSeasons"
  import { useSearchEpisodes } from "@/composables/modules/labcast/useSearchEpisodes"
  import { useUpdateLabCast } from "@/composables/modules/labcast/useUpdateLabCast"
  import { useDeleteLabCast } from "@/composables/modules/labcast/useDeleteLabCast"
  
  definePageMeta({
    layout: 'dashboard'
  })
  
  // Reactive state
  const showCreateModal = ref(false)
  const showDeleteModal = ref(false)
  const editingEpisode = ref<LabCast | null>(null)
  const deletingEpisode = ref<LabCast | null>(null)
  const searchQuery = ref('')
  const selectedSeason = ref('')
  const selectedStatus = ref('')
  const sortBy = ref('publishedAt:desc')
  const perPage = 10
  
  // Composables
  const {
    loading: labcastsLoading,
    error: labcastsError,
    labcasts,
    totalCount: labcastsTotalCount,
    currentPage: labcastsCurrentPage,
    getLabCasts,
    resetState: resetLabcastsState
  } = useGetLabCasts()
  
  const {
    loading: seasonsLoading,
    error: seasonsError,
    seasons,
    getSeasons,
    resetState: resetSeasonsState
  } = useGetSeasons()
  
  const {
    loading: searchLoading,
    error: searchError,
    episodes: searchEpisodes,
    searchTerm,
    searchEpisodes: performSearchEpisodes,
    resetState: resetSearchState
  } = useSearchEpisodes()
  
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
    labcast: updateLabcast,
    updateLabCast,
    resetState: resetUpdateState
  } = useUpdateLabCast()
  
  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
    deleteLabCast,
    resetState: resetDeleteState
  } = useDeleteLabCast()
  
  // Computed
  const currentEpisodes = computed(() => {
    if (searchQuery.value && searchEpisodes.value) {
      return searchEpisodes.value
    }
    return labcasts.value
  })
  
  // Methods
  const loadEpisodes = async (page = 1) => {
    const filters: any = {
      page,
      // limit: perPage,
      sort: sortBy.value
    }
  
    if (selectedSeason.value) {
      filters.season = selectedSeason.value
    }
  
    if (selectedStatus.value) {
      filters.isActive = selectedStatus.value === 'true'
    }
  
    await getLabCasts()
  }
  
  const applyFilters = () => {
    if (searchQuery.value) {
      searchQuery.value = ''
    }
    loadEpisodes(1)
  }
  
  const debouncedSearch = useDebounceFn(async () => {
    if (searchQuery.value.trim()) {
      await performSearchEpisodes({
        query: searchQuery.value,
        limit: perPage
      })
    } else {
      resetSearchState()
      await loadEpisodes(1)
    }
  }, 300)
  
  const changePage = (page: number) => {
    loadEpisodes(page)
  }
  
  const editEpisode = (episode: LabCast) => {
    editingEpisode.value = episode
    showCreateModal.value = true
  }
  
  const deleteEpisode = (episode: LabCast) => {
    deletingEpisode.value = episode
    showDeleteModal.value = true
  }
  
  const confirmDelete = async () => {
    if (deletingEpisode.value) {
      await deleteLabCast(deletingEpisode.value._id)
      if (deleteSuccess.value) {
        showDeleteModal.value = false
        deletingEpisode.value = null
        await loadEpisodes(labcastsCurrentPage.value)
      }
    }
  }
  
  const toggleEpisodeStatus = async (episode: LabCast) => {
    await updateLabCast(episode._id, {
      ...episode,
      isActive: !episode.isActive
    })
    if (updateSuccess.value) {
      await loadEpisodes(labcastsCurrentPage.value)
    }
  }
  
  const handleEpisodeSaved = () => {
    showCreateModal.value = false
    editingEpisode.value = null
    loadEpisodes(labcastsCurrentPage.value)
  }
  
  // Load data on mount
  onMounted(async () => {
    await Promise.all([
      loadEpisodes(),
      getSeasons()
    ])
  })
  </script>
  