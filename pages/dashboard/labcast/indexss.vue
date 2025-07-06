<template>
    <div>  
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mb-8">
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
        <LabcastStatsCard
          title="Avg Duration"
          :value="`${stats?.averageDuration || 0}m`"
          icon="lucide:clock"
          color="red"
          :loading="statsLoading"
        />
        <LabcastStatsCard
          title="Recent Episodes"
          :value="stats?.recentEpisodesCount || 0"
          icon="lucide:calendar"
          color="indigo"
          :loading="statsLoading"
        />
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Latest Episodes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-50">
          <div class="p-6 border-b border-gray-50">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Latest Episodes</h3>
              <NuxtLink
                to="/dashboard/labcast/episodes"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all
              </NuxtLink>
            </div>
          </div>
          <div class="p-6">
            <div v-if="latestEpisodesLoading" class="space-y-4">
              <div v-for="i in 5" :key="i" class="animate-pulse">
                <div class="flex space-x-4">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="latestEpisodes?.length" class="space-y-4">
              <div
                v-for="episode in latestEpisodes.slice(0, 5)"
                :key="episode._id"
                class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
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
                  <p class="text-sm text-gray-500">
                    S{{ episode.season }}E{{ episode.episode }} • {{ episode.duration }}m
                  </p>
                  <div class="flex items-center mt-1">
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
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
            </div>
            <div v-else class="text-center py-8">
              <Icon name="lucide:podcast" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">No episodes found</p>
            </div>
          </div>
        </div>
  
        <!-- Popular Tags -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-50">
          <div class="p-6 border-b border-gray-50">
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
                v-for="(tag, idx) in tags.slice(0, 8)"
                :key="tag.tag"
                class="flex justify-between items-center"
              >
                <span class="text-sm font-medium text-gray-900">{{ tag }}</span>
                <span class="text-sm text-gray-500">{{ idx }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <Icon name="lucide:tag" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">No tags found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { definePageMeta, onMounted } from '#imports'
  import { useGetLabCastStats } from "@/composables/modules/labcast/useGetLabCastStats"
  import { useGetLatestEpisodes } from "@/composables/modules/labcast/useGetLatestEpisodes"
  import { useGetPopularTags } from "@/composables/modules/labcast/useGetPopularTags"
  import Icon from "@/components/Icon.vue"
  
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
  
  // Get latest episodes
  const {
    loading: latestEpisodesLoading,
    error: latestEpisodesError,
    episodes: latestEpisodes,
    getLatestEpisodes,
    resetState: resetLatestEpisodesState
  } = useGetLatestEpisodes()
  
  // Get popular tags
  const {
    loading: tagsLoading,
    error: tagsError,
    tags,
    getPopularTags,
    resetState: resetTagsState
  } = useGetPopularTags()
  
  // Load data on mount
  onMounted(async () => {
    await Promise.all([
      getStats(),
      getLatestEpisodes(),
      getPopularTags()
    ])
  })
  </script>
  