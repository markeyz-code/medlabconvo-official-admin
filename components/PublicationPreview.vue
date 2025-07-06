<template>
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <span
            :class="[
              'px-3 py-1 text-sm font-semibold rounded-full',
              getStatusColor(publication.status)
            ]"
          >
            {{ formatStatus(publication.status) }}
          </span>
          <!-- <button
            @click="$emit('close')"
            class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X class="w-5 h-5" />
          </button> -->
        </div>
        
        <h1 class="text-3xl font-bold text-slate-900 mb-4">
          {{ publication.title }}
        </h1>
        
        <!-- Update the metadata section -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
          <div class="flex items-center space-x-2">
            <User class="w-4 h-4" />
            <span>{{ publication.authors }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <Calendar class="w-4 h-4" />
            <span>{{ publication.year || formatDate(publication.createdAt) }}</span>
          </div>
          <div v-if="publication.journal" class="flex items-center space-x-2">
            <BookOpen class="w-4 h-4" />
            <span>{{ publication.journal }}</span>
          </div>
          <div v-if="publication.category" class="flex items-center space-x-2">
            <Tag class="w-4 h-4" />
            <span>{{ publication.category }}</span>
          </div>
        </div>
      </div>
  
      <!-- Images -->
      <div v-if="publication.images?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Images</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(image, index) in publication.images"
            :key="index"
            class="aspect-video rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
            @click="openImageModal(image)"
          >
            <img
              :src="getImageUrl(image)"
              :alt="`Publication image ${index + 1}`"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>
      </div>
  
      <!-- Abstract -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Abstract</h3>
        <div class="prose prose-slate max-w-none">
          <p class="text-slate-700 leading-relaxed">{{ publication.abstract }}</p>
        </div>
      </div>
  
      <!-- Remove the Keywords section entirely: -->
  
      <!-- Publication Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- <div v-if="publication.doi" class="bg-slate-50 rounded-lg p-4">
          <h4 class="font-semibold text-slate-900 mb-2">DOI</h4>
          <p class="text-slate-700 font-mono text-sm">{{ publication.doi }}</p>
        </div> -->
        
        <div v-if="publication.link" class="bg-slate-50 rounded-lg p-4">
          <h4 class="font-semibold text-slate-900 mb-2">Publication Link</h4>
          <a
            :href="publication.link"
            target="_blank"
            class="text-amber-600 hover:text-amber-700 text-sm break-all inline-flex items-center space-x-1"
          >
            <span>{{ publication.link }}</span>
            <ExternalLink class="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
        
        <div v-if="publication.pubLink" class="bg-slate-50 rounded-lg p-4">
          <h4 class="font-semibold text-slate-900 mb-2">Pub Link</h4>
          <a
            :href="publication.pubLink"
            target="_blank"
            class="text-amber-600 hover:text-amber-700 text-sm break-all inline-flex items-center space-x-1"
          >
            <span>{{ publication.pubLink }}</span>
            <ExternalLink class="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
        
        <div v-if="publication.doiLink" class="bg-slate-50 rounded-lg p-4">
          <h4 class="font-semibold text-slate-900 mb-2">DOI Link</h4>
          <a
            :href="publication.doiLink"
            target="_blank"
            class="text-amber-600 hover:text-amber-700 text-sm break-all inline-flex items-center space-x-1"
          >
            <span>{{ publication.doiLink }}</span>
            <ExternalLink class="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
      </div>
  
      <!-- Image Modal -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="selectedImage"
            class="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
            @click="closeImageModal"
          >
            <div class="relative max-w-4xl max-h-full">
              <img
                :src="getImageUrl(selectedImage)"
                alt="Publication image"
                class="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                @click="closeImageModal"
                class="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { X, User, Calendar, BookOpen, Tag, ExternalLink } from 'lucide-vue-next'
  
  interface Props {
    publication: any
  }
  
  defineProps<Props>()
  defineEmits(['close'])
  
  const selectedImage = ref<string | null>(null)
  
  const openImageModal = (image: string) => {
    selectedImage.value = image
  }
  
  const closeImageModal = () => {
    selectedImage.value = null
  }
  
  const getStatusColor = (status: string) => {
    const colors = {
      'published': 'bg-green-100 text-green-800',
      'approved': 'bg-blue-100 text-blue-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800',
      'draft': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  
  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const getImageUrl = (image: string) => {
    if (image.startsWith('http')) {
      return image
    }
    return `/api/images/${image}`
  }
  </script>
  