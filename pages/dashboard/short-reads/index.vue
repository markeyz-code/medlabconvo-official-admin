<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p class="text-sm text-slate-500">
        <span class="font-semibold text-slate-900">{{ shortReads.length }}</span>
        story {{ shortReads.length === 1 ? 'carousel' : 'carousels' }} in the library
      </p>
      <NuxtLink
        v-if="hasPermission('short_reads:create')"
        to="/dashboard/short-reads/create"
        class="btn btn-primary w-full sm:w-auto"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Create short read
      </NuxtLink>
    </div>

    <div class="bg-white rounded-[18px] border border-slate-100 overflow-hidden">
      <AdminTableLoading v-if="loading" :columns="4" :rows="5" label="Loading short reads" />

      <AdminEmptyState
        v-else-if="!shortReads.length"
        icon="lucide:layers"
        title="No short reads found"
        description="Get started by creating a new short-form story carousel."
      >
        <NuxtLink v-if="hasPermission('short_reads:create')" to="/dashboard/short-reads/create" class="btn btn-primary">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Create short read
        </NuxtLink>
      </AdminEmptyState>

      <div v-else class="table-scroll">
        <table class="admin-table w-full text-left border-collapse stack-table">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-xs  tracking-wider text-gray-500">
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
                    <h3 class="font-semibold text-gray-900 group-hover:text-[#27628C] transition-colors line-clamp-1">{{ read.title }}</h3>
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
                  <NuxtLink v-if="hasPermission('short_reads:update')" :to="`/dashboard/short-reads/${read._id}`" class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </NuxtLink>
                  <button v-if="hasPermission('short_reads:delete')" @click="handleDelete(read._id)" class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
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
    <ConfirmModal
      v-model="isDeleteModalOpen"
      title="Delete short read"
      message="Are you sure you want to delete this short read? This permanently removes the story from the platform."
      confirm-text="Delete short read"
      :loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'short_reads:read'
})

import { ref, onMounted } from 'vue'
import { useGetShortReads } from '@/composables/modules/short-reads/useGetShortReads'
import { useDeleteShortRead } from '@/composables/modules/short-reads/useDeleteShortRead'
import { useUser } from '@/composables/modules/auth/user'
import Icon from '@/components/Icon.vue'
import AdminEmptyState from '@/components/AdminEmptyState.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'

const { shortReads, loading, getShortReads } = useGetShortReads()
const { deleteShortRead } = useDeleteShortRead()
const { hasPermission } = useUser()

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
