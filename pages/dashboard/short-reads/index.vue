<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Short Reads</h2>
        <p class="text-gray-500">Manage Zikoko-style short read stories.</p>
      </div>
      <NuxtLink to="/dashboard/short-reads/create" class="px-4 py-2 bg-[#033958] text-white rounded-lg hover:bg-opacity-90">
        Create Short Read
      </NuxtLink>
    </div>

    <div class="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#033958]"></div>
      </div>
      <div v-else-if="!shortReads.length" class="text-center py-20 text-gray-500">
        <div class="mb-4 text-gray-400">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No short reads found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new Zikoko-style short read.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
              <th class="py-4 px-6 font-semibold">Story Details</th>
              <th class="py-4 px-6 font-semibold">Author</th>
              <th class="py-4 px-6 font-semibold">Status</th>
              <th class="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="read in shortReads" :key="read._id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                    <img v-if="read.coverImageUrl" :src="read.coverImageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 group-hover:text-[#033958] transition-colors line-clamp-1">{{ read.title }}</h3>
                    <p class="text-sm text-gray-500 mt-0.5">{{ read.slides?.length || 0 }} slides</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 text-sm text-gray-600 font-medium">{{ read.author || 'Anonymous' }}</td>
              <td class="py-4 px-6">
                <span :class="{'text-emerald-700 bg-emerald-50 border-emerald-200': read.status === 'published', 'text-amber-700 bg-amber-50 border-amber-200': read.status === 'draft'}" class="px-3 py-1 text-xs font-medium rounded-full border">
                  {{ read.status === 'published' ? 'PUBLISHED' : 'DRAFT' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex justify-end gap-3">
                  <a :href="`https://medlabconvo.com/short-reads/${read.slug || read._id}`" target="_blank" class="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" title="Preview Live">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  </a>
                  <NuxtLink :to="`/dashboard/short-reads/${read._id}`" class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </NuxtLink>
                  <button @click="handleDelete(read._id)" class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="p-6">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Short Read</h3>
          <p class="text-gray-500 text-sm">Are you sure you want to delete this short read? This action cannot be undone and will permanently remove this story from the platform.</p>
        </div>
        <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button @click="isDeleteModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="confirmDelete" :disabled="isDeleting" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2">
            <svg v-if="isDeleting" class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isDeleting ? 'Deleting...' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

import { ref, onMounted } from 'vue'
import { useGetShortReads } from '@/composables/modules/short-reads/useGetShortReads'
import { useDeleteShortRead } from '@/composables/modules/short-reads/useDeleteShortRead'

const { shortReads, loading, getShortReads } = useGetShortReads()
const { deleteShortRead } = useDeleteShortRead()

const isDeleteModalOpen = ref(false)
const shortReadToDelete = ref<string | null>(null)
const isDeleting = ref(false)

onMounted(() => {
  getShortReads()
})

const handleDelete = (id?: string) => {
  if (!id) return
  shortReadToDelete.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!shortReadToDelete.value) return
  
  isDeleting.value = true
  try {
    await deleteShortRead(shortReadToDelete.value)
    await getShortReads()
    isDeleteModalOpen.value = false
  } finally {
    isDeleting.value = false
    shortReadToDelete.value = null
  }
}
</script>
