<template>
  <div class="mt-8 flow-root">
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>
    
    <div v-else class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center sm:justify-between mb-4 px-4 sm:px-0">
          <div>
             <!-- Optional search/filter area -->
          </div>
          <button @click="openCreateModal" type="button" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
             Create Page Record
          </button>
        </div>

        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Page Key</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sections</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="page in cmsPages" :key="page.key">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ page.key }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ page.title }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ page.data?.sections?.length || 0 }} sections</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new Date(page.updatedAt || Date.now()).toLocaleDateString() }}</td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button @click="openEditModal(page)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button @click="handleDelete(page.key)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr v-if="!cmsPages.length">
                <td colspan="5" class="py-10 text-center text-sm text-gray-500">No CMS pages found. Create one.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Slide-over for Edit/Create -->
    <CoreSlideOver :isOpen="isSlideOverOpen" :title="isEditing ? 'Edit CMS Page' : 'Create CMS Page'" @close="closeSlideOver">
      <form @submit.prevent="handleSubmit" class="space-y-6 pt-6 pb-20">
        <div>
          <label for="key" class="block text-sm font-medium text-gray-900">Page Key</label>
          <div class="mt-1">
            <input type="text" id="key" v-model="form.key" :disabled="isEditing" required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g. about_page" />
          </div>
          <p class="mt-1 text-xs text-gray-500">Unique identifier for this page content (cannot be changed after creation).</p>
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-900">Title</label>
          <div class="mt-1">
            <input type="text" id="title" v-model="form.title" required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g. About Us Page Settings" />
          </div>
        </div>

        <div class="border-t border-gray-200 mt-6 pt-6 mb-4 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Page Sections</h3>
            <button type="button" @click="addSection" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Add Section
            </button>
        </div>

        <div v-for="(section, index) in form.data.sections" :key="index" class="border rounded-md p-4 bg-gray-50 space-y-4 mb-4 relative">
          <button type="button" @click="removeSection(index)" class="absolute top-2 right-2 text-gray-400 hover:text-red-500">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
          </button>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700">Section ID / Key</label>
              <input type="text" v-model="section.id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g. identity" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Display Title</label>
              <input type="text" v-model="section.title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g. Identity & Mindset" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Position / Order</label>
              <input type="number" v-model="section.order" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div class="flex items-end">
              <label class="flex items-center space-x-2 text-sm text-gray-700 pb-2">
                <input type="checkbox" v-model="section.isVisible" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <span>Is Visible</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700">Content</label>
            <textarea v-model="section.content" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Text or HTML content..."></textarea>
          </div>
        </div>

        <div v-if="form.data.sections.length === 0" class="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-md border border-dashed">
            No sections added yet. Click "Add Section" to create one.
        </div>

        <div class="flex justify-end gap-3 border-t border-gray-200 mt-6 pt-6">
          <button type="button" @click="closeSlideOver"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-full sm:w-auto">
            Cancel
          </button>
          <button type="submit" :disabled="isSaving"
            class="flex justify-center flex-1 rounded-md border border-transparent bg-indigo-600 border-indigo-600 py-2.5 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 w-full sm:w-auto">
            <span v-if="!isSaving">{{ isEditing ? 'Save Changes' : 'Create Page' }}</span>
            <div v-else class="h-5 w-5 rounded-full border-t-2 border-white animate-spin"></div>
          </button>
        </div>
      </form>
    </CoreSlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGetCms } from '@/composables/modules/cms/useGetCms'
import { useUpsertCms } from '@/composables/modules/cms/useUpsertCms'
import { useDeleteCms } from '@/composables/modules/cms/useDeleteCms'
import type { CmsDocument, UpsertCmsPayload, CmsSection } from '@/api_factory/modules/cms'

const { loading, error, cmsPages, getAllCms } = useGetCms()
const { loading: isSaving, upsertCms } = useUpsertCms()
const { loading: isDeleting, deleteCms } = useDeleteCms()

const isSlideOverOpen = ref(false)
const isEditing = ref(false)

const form = ref<UpsertCmsPayload>({
  key: '',
  title: '',
  data: {
    sections: []
  }
})

onMounted(() => {
  getAllCms()
})

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    key: '',
    title: '',
    data: {
      sections: []
    }
  }
  isSlideOverOpen.value = true
}

const openEditModal = (page: CmsDocument) => {
  isEditing.value = true
  form.value = {
    key: page.key,
    title: page.title,
    data: {
      sections: JSON.parse(JSON.stringify(page.data?.sections || []))
    }
  }
  isSlideOverOpen.value = true
}

const closeSlideOver = () => {
  isSlideOverOpen.value = false
}

const addSection = () => {
  form.value.data.sections.push({
    id: `section_${Date.now()}`,
    title: '',
    content: '',
    isVisible: true,
    order: form.value.data.sections.length + 1
  })
}

const removeSection = (index: number) => {
  form.value.data.sections.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    await upsertCms(form.value)
    closeSlideOver()
    getAllCms()
  } catch (err) {
    console.error(err)
  }
}

const handleDelete = async (key: string) => {
  if (confirm('Are you sure you want to delete this CMS page? This will break any frontend views relying on this key.')) {
    try {
      await deleteCms(key)
      getAllCms()
    } catch (err) {
      console.error(err)
    }
  }
}
</script>
