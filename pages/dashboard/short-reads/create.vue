<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-lg font-bold text-gray-900">Create Short Read</h2>
        <p class="text-gray-500">Build an immersive swipeable carousel.</p>
      </div>
      <button @click="submit" :disabled="loading" class="px-4 py-2 bg-[#033958] text-white rounded-lg disabled:opacity-50">
        {{ loading ? 'Saving...' : 'Save Short Read' }}
      </button>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input v-model="form.title" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Enter title" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Author</label>
        <input v-model="form.author" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Enter author name" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select v-model="form.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
        <div class="h-48 w-full max-w-sm">
            <ImageUpload v-model="form.coverImageUrl" />
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-bold">Slides (Carousel)</h3>
        <button @click="addSlide" class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
          + Add Slide
        </button>
      </div>

      <div v-for="(slide, index) in form.slides" :key="index" class="p-4 border rounded-md relative bg-gray-50">
        <button @click="removeSlide(index)" class="absolute top-2 right-2 text-red-500 hover:text-red-700">&times; Remove</button>
        <h4 class="font-medium mb-3">Slide {{ index + 1 }}</h4>
        
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700">Type</label>
            <select v-model="slide.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm">
              <option value="text">Text Only</option>
              <option value="image">Image Only</option>
              <option value="mixed">Mixed (Image + Text)</option>
            </select>
          </div>
          
          <div v-if="slide.type !== 'image'">
            <label class="block text-xs font-medium text-gray-700">Content</label>
            <textarea v-model="slide.content" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm"></textarea>
          </div>
          
          <div v-if="slide.type !== 'text'">
            <label class="block text-xs font-medium text-gray-700 mb-2">Media Image</label>
            <div class="h-32 w-full max-w-sm">
              <ImageUpload v-model="slide.mediaUrl" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="!form.slides.length" class="text-gray-500 text-center py-4">No slides added yet.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateShortRead } from '@/composables/modules/short-reads/useCreateShortRead'
import type { CreateShortReadData } from '@/api_factory/modules/short-reads'
import { useCustomToast } from "@/composables/core/useCustomToast"

const { createShortRead, loading } = useCreateShortRead()
const router = useRouter()
const { showToast } = useCustomToast()

const form = ref<CreateShortReadData>({
  title: '',
  author: '',
  coverImageUrl: '',
  status: 'draft',
  slides: []
})

const addSlide = () => {
  form.value.slides!.push({ type: 'text', content: '' })
}

const removeSlide = (index: number) => {
  form.value.slides!.splice(index, 1)
}

const submit = async () => {
  if (!form.value.title || !form.value.coverImageUrl) {
    showToast({ title: 'Error', message: 'Title and Cover Image are required.', type: 'error' })
    return
  }
  
  await createShortRead(form.value)
  router.push('/dashboard/short-reads')
}
</script>
