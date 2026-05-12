<template>
    <div class="p-6 hover:bg-gray-50 transition-colors">
      <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <!-- Thumbnail -->
        <div class="flex-shrink-0">
          <img
            :src="episode.thumbnailUrl"
            :alt="episode.title"
            class="w-20 h-20 rounded-lg object-cover"
          />
        </div>
  
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 truncate">
                {{ episode.title }}
              </h3>
              <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                {{ episode.description }}
              </p>
              
              <div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-900">
                <span class="flex items-center">
                  <Icon name="lucide:layers" class="w-4 h-4 mr-1" />
                  S{{ episode.season }}E{{ episode.episode }}
                </span>
                <span class="flex items-center">
                  <Icon name="lucide:clock" class="w-4 h-4 mr-1" />
                  {{ episode.duration }}m
                </span>
                <span class="flex items-center">
                  <Icon name="lucide:calendar" class="w-4 h-4 mr-1" />
                  {{ formatDate(episode.publishedAt) }}
                </span>
              </div>
  
              <!-- Hosts and Guest -->
              <div class="mt-3">
                <div class="flex flex-wrap items-center gap-2 text-sm">
                  <span class="text-gray-900">Hosts:</span>
                  <span v-for="host in episode.hosts" :key="host" class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {{ host }}
                  </span>
                </div>
                <div v-if="episode.guest" class="flex items-center gap-2 text-sm mt-2">
                  <span class="text-gray-900">Guest:</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {{ episode.guest }} ({{ episode.guestTitle }})
                  </span>
                </div>
              </div>
  
              <!-- Tags -->
              <div v-if="episode.tags?.length" class="flex flex-wrap gap-1 mt-3">
                <span
                  v-for="tag in episode.tags.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {{ tag }}
                </span>
                <span
                  v-if="episode.tags.length > 3"
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  +{{ episode.tags.length - 3 }} more
                </span>
              </div>
            </div>
  
            <!-- Actions -->
            <div class="flex items-center space-x-2 mt-4 sm:mt-0">
              <!-- Status Toggle -->
              <button
                @click="$emit('toggle-status', episode)"
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  episode.isActive
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                ]"
              >
                <Icon
                  :name="episode.isActive ? 'lucide:eye' : 'lucide:eye-off'"
                  class="w-3 h-3 mr-1"
                />
                {{ episode.isActive ? 'Active' : 'Inactive' }}
              </button>
  
              <!-- External Links -->
              <div class="flex items-center space-x-1">
                <a
                  v-if="episode.spotifyUrl"
                  :href="episode.spotifyUrl"
                  target="_blank"
                  class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  title="Open in Spotify"
                >
                  <!-- <Icon name="lucide:music" class="w-4 h-4" /> -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"></path></svg>
                </a>
                <a
                  v-if="episode.appleUrl"
                  :href="episode.appleUrl"
                  target="_blank"
                  class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Open in Apple Podcasts"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.12,88.12,0,0,1,190.54,65.93,87.39,87.39,0,0,1,215.65,120H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h24a24,24,0,0,1-24,24H136a8,8,0,0,0,0,16h56a40,40,0,0,0,40-40V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm128,56a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24v56Z"></path></svg>
                  <!-- <Icon name="lucide:headphones" class="w-4 h-4" /> -->
                </a>
              </div>
  
              <!-- Action Buttons -->
              <div class="flex items-center space-x-1">
                <button
                  @click="$emit('edit', episode)"
                  class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit episode"
                >
                  <!-- <Icon name="lucide:edit" class="w-4 h-4" /> -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M225,80.4,183.6,39a24,24,0,0,0-33.94,0L31,157.66a24,24,0,0,0,0,33.94l30.06,30.06A8,8,0,0,0,66.74,224H216a8,8,0,0,0,0-16h-84.7L225,114.34A24,24,0,0,0,225,80.4ZM108.68,208H70.05L42.33,180.28a8,8,0,0,1,0-11.31L96,115.31,148.69,168Zm105-105L160,156.69,107.31,104,161,50.34a8,8,0,0,1,11.32,0l41.38,41.38a8,8,0,0,1,0,11.31Z"></path></svg>
                   <!-- Edit -->
                </button>
                <button
                  @click="$emit('delete', episode)"
                  class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete episode"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                 <!-- Delete -->
                  <!-- <Icon name="lucide:trash-2" class="w-4 h-4" /> -->
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { LabCast } from '@/types/labcast'
  
  interface Props {
    episode: LabCast
  }
  
  defineProps<Props>()
  
  defineEmits<{
    edit: [episode: LabCast]
    delete: [episode: LabCast]
    'toggle-status': [episode: LabCast]
  }>()
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  </script>
  