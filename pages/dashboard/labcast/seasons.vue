<template>
    <div>
      <LabcastAdminHeader 
        title="Seasons" 
        subtitle="Manage your LabCast seasons and episodes"
      />
  
      <!-- Seasons Grid -->
      <div v-if="seasonsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="h-6 bg-gray-200 rounded w-24 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
  
      <div v-else-if="seasons?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="season in seasons"
          :key="season.season"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          @click="viewSeason(season.season)"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900">
              Season {{ season.season }}
            </h3>
            <Icon name="lucide:chevron-right" class="w-5 h-5 text-gray-400" />
          </div>
          
          <div class="space-y-2">
            <p class="text-sm text-gray-600">
              {{ season.episodeCount }} {{ season.episodeCount === 1 ? 'episode' : 'episodes' }}
            </p>
            
            <div class="flex items-center text-sm text-gray-900">
              <Icon name="lucide:calendar" class="w-4 h-4 mr-1" />
              <span>Season {{ season.season }}</span>
            </div>
          </div>
        </div>
      </div>
  
      <div v-else class="text-center py-12">
        <Icon name="lucide:layers" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No seasons found</h3>
        <p class="text-gray-900">Create your first episode to get started.</p>
      </div>
  
      <!-- Season Episodes Modal -->
      <div
        v-if="showSeasonModal"
        class="fixed inset-0 z-50 overflow-y-auto"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
  
          <div class="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-sm border border-slate-200 rounded-lg">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                Season {{ selectedSeason }} Episodes
              </h3>
              <button
                @click="showSeasonModal = false"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="lucide:x" class="w-6 h-6" />
              </button>
            </div>
  
            <div v-if="episodesBySeasonLoading" class="space-y-4">
              <div v-for="i in 5" :key="i" class="animate-pulse">
                <div class="flex space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
  
            <div v-else-if="episodesBySeason?.length" class="space-y-4 max-h-96 overflow-y-auto">
              <div
                v-for="episode in episodesBySeason"
                :key="episode._id"
                class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  :src="episode.thumbnailUrl"
                  :alt="episode.title"
                  class="w-16 h-16 rounded-lg object-cover"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate">
                    {{ episode.title }}
                  </h4>
                  <p class="text-sm text-gray-900">
                    Episode {{ episode.episode }} • {{ episode.duration }}m
                  </p>
                  <div class="flex items-center mt-1">
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-1 rounded-full text-sm font-medium',
                        episode.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ episode.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <NuxtLink
                    :to="`/admin/episodes?season=${episode.season}&episode=${episode.episode}`"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View
                  </NuxtLink>
                </div>
              </div>
            </div>
  
            <div v-else class="text-center py-8">
              <Icon name="lucide:podcast" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-900">No episodes found for this season</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from '#imports'
  import { useGetSeasons } from "@/composables/modules/labcast/useGetSeasons"
  import { useGetEpisodesBySeason } from "@/composables/modules/labcast/useGetEpisodesBySeason"
  import Icon from '@/components/Icon.vue'
  
 definePageMeta({
    layout: 'dashboard'
  })
  
  const showSeasonModal = ref(false)
  const selectedSeason = ref<number | null>(null)
  
  // Get all available seasons
  const {
    loading: seasonsLoading,
    error: seasonsError,
    seasons,
    getSeasons,
    resetState: resetSeasonsState
  } = useGetSeasons()
  
  // Get episodes by season
  const {
    loading: episodesBySeasonLoading,
    error: episodesBySeasonError,
    episodes: episodesBySeason,
    getEpisodesBySeason,
    resetState: resetEpisodesBySeasonState
  } = useGetEpisodesBySeason()
  
  const viewSeason = async (seasonNumber: number) => {
    selectedSeason.value = seasonNumber
    showSeasonModal.value = true
    await getEpisodesBySeason({ season: seasonNumber })
  }
  
  // Load data on mount
  onMounted(async () => {
    await getSeasons()
  })
  </script>
  