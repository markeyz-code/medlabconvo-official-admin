<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#27628C]/10 flex items-center justify-center text-[#27628C]">
          <Icon name="lucide:tags" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Journo Categories</h2>
          <p class="text-sm font-medium text-slate-500">Manage categories for publications.</p>
        </div>
      </div>
      
      <button v-if="hasPermission('publications:create')"
        @click="openCreateModal"
        class="px-6 py-3 bg-[#27628C] text-white text-sm font-bold rounded-xl hover:bg-[#1B4A6B] transition-all flex items-center gap-2"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        <span>New Category</span>
      </button>
    </div>

    <!-- Categories List -->
    <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      <AdminTableLoading v-if="loading" :columns="2" :rows="4" label="Loading categories" />

      <AdminEmptyState
        v-else-if="categories.length === 0"
        icon="lucide:tags"
        title="No categories found"
        description="Get started by creating your first Journo category."
      >
        <button v-if="hasPermission('publications:create')" class="btn btn-primary" @click="openCreateModal">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Create category
        </button>
      </AdminEmptyState>

      <table v-else class="admin-table stack-table w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100">
            <th class="px-6 py-4 text-xs font-bold text-slate-400  tracking-wider">Category Name</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-400  tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="cat in categories" :key="cat._id" class="hover:bg-slate-50/50 transition-colors group">
            <td class="px-6 py-4">
              <span class="text-sm font-bold text-slate-700">{{ cat.name }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-2 transition-opacity">
                <button v-if="hasPermission('publications:update')"
                  @click="openEditModal(cat)"
                  class="p-2 text-slate-400 hover:text-[#27628C] hover:bg-[#27628C]/10 rounded-lg transition-all"
                  title="Edit category"
                >
                  <Icon name="lucide:edit-2" class="w-4 h-4" />
                </button>
                <button v-if="hasPermission('publications:delete')"
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
    <Modal v-model="showFormModal" :title="editingCategory ? 'Edit category' : 'Create category'" eyebrow="Journo" size="sm">
      <form id="category-form" @submit.prevent="handleSubmit">
        <AnimatedInput v-model="form.name" id="category-name" label="Category name" required />
      </form>
      <template #footer>
        <button type="button" class="btn btn-outline" @click="showFormModal = false">Cancel</button>
        <button type="submit" form="category-form" class="btn btn-primary" :disabled="saving">
          <Icon v-if="saving" name="lucide:loader-2" class="h-3.5 w-3.5 animate-spin" />
          {{ saving ? 'Saving…' : editingCategory ? 'Save changes' : 'Create category' }}
        </button>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete category"
      :message="`Delete “${categoryToDelete?.name || 'this category'}”? This cannot be undone.`"
      confirm-text="Delete category"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCategories } from '@/composables/modules/publications/useCategories'
import Modal from '@/components/Modal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import Icon from '@/components/Icon.vue'
import { useUser } from '@/composables/modules/auth/user'
import AdminEmptyState from '@/components/AdminEmptyState.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'

const { hasPermission } = useUser()

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
