<template>
    <div>
      <AdminHeader 
        title="Analytics" 
        subtitle="Detailed insights and statistics for your LabCast episodes"
      />
  
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <LabcastStatsCard
          title="Total Episodes"
          :value="stats?.totalEpisodes || 0"
          icon="lucide:podcast"
          color="blue"
          :loading="statsLoading"
        />
        <LabcastStatsCard
          title="Total Seasons"
          :value="stats?.totalSeasons || 0"
          icon="lucide:layers"
          color="green"
          :loading="statsLoading"
        />
        <LabcastStatsCard
          title="Total Hosts"
          :value="stats?.totalHosts || 0"
          icon="lucide:users"
          color="purple"
          :loading="statsLoading"
        />
        <LabcastStatsCard
          title="Total Guests"
          :value="stats?.totalGuests || 0"
          icon="lucide:user-plus"
          color="orange"
          :loading="statsLoading"
        />
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Episodes by Season -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Episodes by Season</h3>
          </div>
          <div class="p-6">
            <div v-if="seasonsLoading" class="space-y-4">
              <div v-for="i in 5" :key="i" class="animate-pulse">
                <div class="flex justify-between items-center">
                  <div class="h-4 bg-gray-200 rounded w-20"></div>
                  <div class="h-4 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </div>
            <div v-else-if="seasons?.length" class="space-y-4">
              <div
                v-for="season in seasons"
                :key="season.season"
                class="flex justify-between items-center"
              >
                <span class="text-sm font-medium text-gray-900">
                  Season {{ season.season }}
                </span>
                <div class="flex items-center space-x-2">
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-primary h-2 rounded-full"
                      :style="{ width: `${(season.episodeCount / maxEpisodesInSeason) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-900 w-8 text-right">
                    {{ season.episodeCount }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <Icon name="lucide:bar-chart-3" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-900">No season data available</p>
            </div>
          </div>
        </div>
  
        <!-- Popular Tags -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Popular Tags</h3>
          </div>
          <div class="p-6">
            <div v-if="tagsLoading" class="space-y-3">
              <div v-for="i in 8" :key="i" class="animate-pulse">
                <div class="flex justify-between items-center">
                  <div class="h-4 bg-gray-200 rounded w-24"></div>
                  <div class="h-4 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </div>
            <div v-else-if="tags?.length" class="space-y-3">
              <div
                v-for="tag in tags"
                :key="tag.tag"
                class="flex justify-between items-center"
              >
                <span class="text-sm font-medium text-gray-900">{{ tag.tag }}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-green-600 h-2 rounded-full"
                      :style="{ width: `${(tag.count / maxTagCount) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-900 w-6 text-right">
                    {{ tag.count }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <Icon name="lucide:tag" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-900">No tag data available</p>
            </div>
          </div>
        </div>
  
        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Recent Episodes</h3>
          </div>
          <div class="p-6">
            <div v-if="latestEpisodesLoading" class="space-y-4">
              <div v-for="i in 5" :key="i" class="animate-pulse">
                <div class="flex space-x-4">
                  <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="latestEpisodes?.length" class="space-y-4">
              <div
                v-for="episode in latestEpisodes"
                :key="episode._id"
                class="flex items-center space-x-4"
              >
                <img
                  :src="episode.thumbnailUrl"
                  :alt="episode.title"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate">
                    {{ episode.title }}
                  </h4>
                  <p class="text-sm text-gray-900">
                    S{{ episode.season }}E{{ episode.episode }} • 
                    {{ formatDate(episode.publishedAt) }}
                  </p>
                </div>
                <div class="flex items-center">
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
            </div>
            <div v-else class="text-center py-8">
              <Icon name="lucide:activity" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-900">No recent episodes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useGetLabCastStats } from "@/composables/modules/labcast/useGetLabCastStats"
  import { useGetSeasons } from "@/composables/modules/labcast/useGetSeasons"
  import { useGetPopularTags } from "@/composables/modules/labcast/useGetPopularTags"
  import { useGetLatestEpisodes } from "@/composables/modules/labcast/useGetLatestEpisodes"
  
  import { computed, onMounted } from 'vue'
  // import Icon from '#components/Icon.vue'
  
  definePageMeta({
    layout: 'dashboard'
  })
  
  // Get LabCast statistics
  const {
    loading: statsLoading,
    error: statsError,
    stats,
    getStats,
    resetState: resetStatsState
  } = useGetLabCastStats()
  
  // Get all available seasons
  const {
    loading: seasonsLoading,
    error: seasonsError,
    seasons,
    getSeasons,
    resetState: resetSeasonsState
  } = useGetSeasons()
  
  // Get popular tags
  const {
    loading: tagsLoading,
    error: tagsError,
    tags,
    getPopularTags,
    resetState: resetTagsState
  } = useGetPopularTags()
  
  // Get latest episodes
  const {
    loading: latestEpisodesLoading,
    error: latestEpisodesError,
    episodes: latestEpisodes,
    getLatestEpisodes,
    resetState: resetLatestEpisodesState
  } = useGetLatestEpisodes()
  
  // Computed values for charts
  const maxEpisodesInSeason = computed(() => {
    if (!seasons.value?.length) return 1
    return Math.max(...seasons.value.map(s => s.episodeCount))
  })
  
  const maxTagCount = computed(() => {
    if (!tags.value?.length) return 1
    return Math.max(...tags.value.map(t => t.count))
  })
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Load data on mount
  onMounted(async () => {
    await Promise.all([
      getStats(),
      getSeasons(),
      getPopularTags(),
      getLatestEpisodes()
    ])
  })
  </script>
  