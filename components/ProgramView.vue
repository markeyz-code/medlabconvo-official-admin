<template>
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <span
            :class="[
              'px-3 py-1 text-sm font-semibold rounded-full',
              getStatusColor(program.status)
            ]"
          >
            {{ formatStatus(program.status) }}
          </span>
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('edit', program)"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
            >
              <Edit class="w-4 h-4" />
              <span>Edit</span>
            </button>
            <!-- <button
              @click="$emit('close')"
              class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X class="w-5 h-5" />
            </button> -->
          </div>
        </div>
        
        <h1 class="text-lg font-bold text-slate-900 mb-2">
          {{ program.title }}
        </h1>
        <p class="text-lg text-indigo-600 font-medium mb-4">{{ program.category }}</p>
        
        <div class="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
          <div class="flex items-center space-x-2">
            <Clock class="w-4 h-4" />
            <span>{{ program.duration }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <Users class="w-4 h-4" />
            <span>{{ program.applicationsCount || 0 }} applications</span>
          </div>
          <div class="flex items-center space-x-2">
            <Calendar class="w-4 h-4" />
            <span>Created {{ formatDate(program.createdAt) }}</span>
          </div>
        </div>
      </div>
  
      <!-- Main Image -->
      <div v-if="program.image" class="mb-8">
        <img
          :src="program.image"
          :alt="program.title"
          class="w-full h-64 object-cover rounded-xl"
        />
      </div>
  
      <!-- Description -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Description</h3>
        <div class="prose prose-slate max-w-none">
          <p class="text-slate-700 leading-relaxed">{{ program.description }}</p>
        </div>
      </div>
  
      <!-- Focus Areas -->
      <div v-if="program.focusAreas?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Focus Areas</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="area in program.focusAreas"
            :key="area"
            class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
          >
            {{ area }}
          </span>
        </div>
      </div>
  
      <!-- Learning Outcomes -->
      <div v-if="program.outcomes?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Learning Outcomes</h3>
        <ul class="space-y-2">
          <li
            v-for="outcome in program.outcomes"
            :key="outcome"
            class="flex items-start space-x-2"
          >
            <Check class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span class="text-slate-700">{{ outcome }}</span>
          </li>
        </ul>
      </div>
  
      <!-- Program Schedule -->
      <div v-if="program.keyResponsibilities?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Program Schedule</h3>
        <ul class="space-y-2">
          <li
            v-for="responsibility in program.keyResponsibilities"
            :key="responsibility"
            class="flex items-start space-x-2"
          >
            <ArrowRight class="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <span class="text-slate-700">{{ responsibility }}</span>
          </li>
        </ul>
      </div>
  
      <!-- Highlights -->
      <div v-if="program.highlights?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Program Highlights</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="highlight in program.highlights"
            :key="highlight._id"
            class="bg-slate-50 rounded-lg p-6"
          >
            <h4 class="font-semibold text-slate-900 mb-2">{{ highlight.title }}</h4>
            <p class="text-slate-700 text-sm">{{ highlight.description }}</p>
          </div>
        </div>
      </div>
  
      <!-- Additional Images -->
      <div v-if="program.images?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Gallery</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(image, index) in program.images"
            :key="index"
            class="aspect-video rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
            @click="openImageModal(image)"
          >
            <img
              :src="image"
              :alt="`Program image ${index + 1}`"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>
      </div>
  
      <!-- Application Form Preview -->
      <div v-if="program.formFields?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Application Form</h3>
        <div class="bg-slate-50 rounded-xl p-6">
          <h4 class="font-semibold text-slate-900 mb-2">{{ program.formTitle }}</h4>
          <p v-if="program.formInstructions" class="text-slate-600 mb-4">{{ program.formInstructions }}</p>
          <div class="space-y-3">
            <div
              v-for="field in program.formFields.slice(0, 5)"
              :key="field._id"
              class="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0"
            >
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-slate-700">{{ field.label }}</span>
                <span v-if="field.required" class="text-red-500 text-sm">*</span>
              </div>
              <span class="text-sm text-slate-500 bg-slate-200 px-2 py-1 rounded">{{ field.type }}</span>
            </div>
            <div v-if="program.formFields.length > 5" class="text-center py-2">
              <span class="text-sm text-slate-500">+{{ program.formFields.length - 5 }} more fields</span>
            </div>
          </div>
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
                :src="selectedImage"
                alt="Program image"
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
  import { 
    X, Edit, Clock, Users, Calendar, Check, ArrowRight 
  } from 'lucide-vue-next'
  
  interface Props {
    program: any
  }
  
  defineProps<Props>()
  defineEmits(['close', 'edit'])
  
  const selectedImage = ref<string | null>(null)
  
  const openImageModal = (image: string) => {
    selectedImage.value = image
  }
  
  const closeImageModal = () => {
    selectedImage.value = null
  }
  
  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  </script>
  