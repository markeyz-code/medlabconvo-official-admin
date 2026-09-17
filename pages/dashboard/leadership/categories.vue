<template>
  <main class="min-h-screen">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
      <div class="px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="router.back()"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-slate-800">Manage Categories</h1>
        </div>
        <button @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="p-6">
      <div class="max-w-4xl mx-auto">
        <div v-if="loading" class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4 w-24 text-center">Position</th>
                <th class="px-6 py-4 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="category in categories" :key="category._id" class="hover:bg-slate-50/50">
                <td class="px-6 py-4 font-medium text-slate-900">{{ category.name }}</td>
                <td class="px-6 py-4 text-center text-slate-500">{{ category.position }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEditModal(category)"
                      class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button @click="deleteCategory(category._id)"
                      class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="categories.length === 0">
                <td colspan="3" class="px-6 py-12 text-center text-slate-500">
                  No categories found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal (simplified as a basic dialog overlay for brevity) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-800">{{ editingId ? 'Edit Category' : 'New Category' }}</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form @submit.prevent="saveCategory" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
            <input v-model="form.name" type="text" required
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="e.g. Board of Directors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Position (Order)</label>
            <input v-model.number="form.position" type="number" required
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
            <button type="submit" :disabled="saving"
              class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium disabled:opacity-50">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { teams_api, type TeamCategory } from '@/api_factory/modules/teams'

const router = useRouter()
const categories = ref<TeamCategory[]>([])
const loading = ref(false)
const saving = ref(false)

const isModalOpen = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', position: 0 })

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await teams_api.$_get_categories()
    categories.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

const openCreateModal = () => {
  editingId.value = null
  form.value = { name: '', position: categories.value.length + 1 }
  isModalOpen.value = true
}

const openEditModal = (category: TeamCategory) => {
  editingId.value = category._id!
  form.value = { name: category.name, position: category.position }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCategory = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await teams_api.$_update_category(editingId.value, form.value)
    } else {
      await teams_api.$_create_category(form.value)
    }
    await fetchCategories()
    closeModal()
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}

const deleteCategory = async (id?: string) => {
  if (!id || !confirm('Are you sure you want to delete this category?')) return
  try {
    await teams_api.$_delete_category(id)
    await fetchCategories()
  } catch (error) {
    console.error(error)
  }
}
</script>
