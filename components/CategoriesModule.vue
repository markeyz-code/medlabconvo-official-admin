<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#033958]/10 flex items-center justify-center text-[#033958]">
          <Icon name="lucide:tags" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Journo Categories</h2>
          <p class="text-sm font-medium text-slate-500">Manage categories for publications.</p>
        </div>
      </div>
      
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-[#033958] text-white text-sm font-bold rounded-xl hover:bg-[#022a41] transition-all flex items-center gap-2"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        <span>New Category</span>
      </button>
    </div>

    <!-- Categories List -->
    <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100">
            <th class="px-6 py-4 text-xs font-bold text-slate-400  tracking-wider">Category Name</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-400  tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
            <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-1/3"></div></td>
            <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-8 ml-auto"></div></td>
          </tr>
          <tr v-else-if="categories.length === 0">
            <td colspan="2" class="px-6 py-10 text-center">
              <div class="flex flex-col items-center justify-center">
                <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                  <Icon name="lucide:inbox" class="w-8 h-8" />
                </div>
                <h3 class="text-slate-900 font-bold mb-1">No categories found</h3>
                <p class="text-slate-500 text-sm mb-4">Get started by creating your first category.</p>
                <button
                  @click="openCreateModal"
                  class="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  <Icon name="lucide:plus" class="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </div>
            </td>
          </tr>
          <tr v-for="cat in categories" :key="cat._id" class="hover:bg-slate-50/50 transition-colors group">
            <td class="px-6 py-4">
              <span class="text-sm font-bold text-slate-700">{{ cat.name }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-2 transition-opacity">
                <button
                  @click="openEditModal(cat)"
                  class="p-2 text-slate-400 hover:text-[#033958] hover:bg-[#033958]/10 rounded-lg transition-all"
                  title="Edit category"
                >
                  <Icon name="lucide:edit-2" class="w-4 h-4" />
                </button>
                <button
                  @click="openDeleteModal(cat)"
                  class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete category"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Category Form Modal -->
    <Modal v-model="showFormModal" :title="editingCategory ? 'Edit Category' : 'Create Category'" size="md">
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <AnimatedInput
          v-model="form.name"
          id="category-name"
          label="Category Name"

          required
        />
        
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            @click="showFormModal = false"
            class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2.5 bg-[#033958] text-white text-sm font-bold rounded-xl hover:bg-[#022a41] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <span>{{ editingCategory ? 'Save Changes' : 'Create Category' }}</span>
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Delete Category" size="sm">
      <div class="p-6">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="lucide:alert-triangle" class="w-8 h-8 text-red-600" />
        </div>
        <div class="text-center mb-8">
          <h3 class="text-lg font-bold text-slate-900 mb-2">Delete Category?</h3>
          <p class="text-sm font-medium text-slate-500 leading-relaxed">
            Are you sure you want to delete <span class="text-slate-700 font-bold">"{{ categoryToDelete?.name }}"</span>? This action cannot be undone.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2.5 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon v-if="deleting" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCategories } from '@/composables/modules/publications/useCategories'
import Modal from '@/components/Modal.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import Icon from '@/components/Icon.vue'

const { categories, loading, getCategories, createCategory, updateCategory, deleteCategory } = useCategories()

onMounted(() => {
  getCategories()
})

// Form State
const showFormModal = ref(false)
const saving = ref(false)
const editingCategory = ref<any>(null)
const form = reactive({ name: '' })

const openCreateModal = () => {
  editingCategory.value = null
  form.name = ''
  showFormModal.value = true
}

const openEditModal = (cat: any) => {
  editingCategory.value = cat
  form.name = cat.name
  showFormModal.value = true
}

const handleSubmit = async () => {
  if (!form.name.trim()) return
  
  saving.value = true
  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value._id, { name: form.name })
    } else {
      await createCategory({ name: form.name })
    }
    showFormModal.value = false
  } finally {
    saving.value = false
  }
}

// Delete State
const showDeleteModal = ref(false)
const deleting = ref(false)
const categoryToDelete = ref<any>(null)

const openDeleteModal = (cat: any) => {
  categoryToDelete.value = cat
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!categoryToDelete.value) return
  
  deleting.value = true
  try {
    await deleteCategory(categoryToDelete.value._id)
    showDeleteModal.value = false
  } finally {
    deleting.value = false
  }
}
</script>
