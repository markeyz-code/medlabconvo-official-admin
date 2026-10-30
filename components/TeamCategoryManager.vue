<template>
  <div class="space-y-4">
    <!-- Header/Form Area -->
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 class="mb-3 text-sm font-semibold text-slate-900">{{ editingId ? 'Edit Category' : 'Create New Category' }}</h3>
      <form @submit.prevent="saveCategory" class="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div class="w-full flex-1">
          <AnimatedInput
            v-model="form.name"
            id="categoryName"
            label="Category Name"
            type="text"
            required
          />
        </div>
        <div class="w-full sm:w-24">
          <AnimatedInput
            v-model="form.position"
            id="categoryPosition"
            label="Order"
            type="number"
            required
          />
        </div>
        <div class="flex gap-2">
          <button v-if="editingId" type="button" @click="resetForm" class="btn btn-outline">
            Cancel
          </button>
          <button type="submit" :disabled="saving" class="btn btn-primary">
            {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>

    <!-- List Area -->
    <div class="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
      <AdminTableLoading v-if="loading" :columns="3" :rows="3" label="Loading categories" />

      <AdminEmptyState
        v-else-if="categories.length === 0"
        icon="lucide:tags"
        title="No categories found"
        description="Create a category using the form above."
        compact
      />

      <table v-else class="admin-table stack-table w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100">
            <th class="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Category Name</th>
            <th class="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Order</th>
            <th class="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="category in categories" :key="category._id" class="group hover:bg-slate-50/50 transition-colors">
            <td class="px-4 py-3 text-xs font-semibold text-slate-900">{{ category.name }}</td>
            <td class="px-4 py-3 text-center text-xs text-slate-500">{{ category.position }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button @click="editCategory(category)" class="p-2 text-[#27628C] hover:bg-[#27628C]/10 rounded-lg border border-transparent hover:border-[#27628C]/20 transition-all" title="Edit">
                  <Icon name="lucide:square-pen" class="w-4 h-4" />
                </button>
                <button @click="deleteCategory(category._id)" class="p-2 text-rose-500 hover:bg-rose-100 rounded-lg border border-transparent hover:border-rose-200 transition-all" title="Delete">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { teams_api, type TeamCategory } from '@/api_factory/modules/teams'
import { useCustomToast } from '@/composables/core/useCustomToast'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import Icon from '@/components/Icon.vue'
import AdminEmptyState from '@/components/AdminEmptyState.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'

const emit = defineEmits(['changed', 'close'])
const { showToast } = useCustomToast()

const categories = ref<TeamCategory[]>([])
const loading = ref(false)
const saving = ref(false)

const editingId = ref<string | null>(null)
const form = ref({ name: '', position: 1 })

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await teams_api.$_get_categories()
    categories.value = res.data.sort((a, b) => (a.position || 0) - (b.position || 0))
    if (!editingId.value) {
      form.value.position = categories.value.length + 1
    }
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to load categories', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)

const resetForm = () => {
  editingId.value = null
  form.value = { name: '', position: categories.value.length + 1 }
}

const editCategory = (category: TeamCategory) => {
  editingId.value = category._id!
  form.value = { name: category.name, position: category.position }
}

const saveCategory = async () => {
  if (!form.value.name.trim()) return
  
  saving.value = true
  try {
    if (editingId.value) {
      await teams_api.$_update_category(editingId.value, form.value)
      showToast({ title: 'Success', message: 'Category updated', toastType: 'success' })
    } else {
      await teams_api.$_create_category(form.value)
      showToast({ title: 'Success', message: 'Category created', toastType: 'success' })
    }
    resetForm()
    await fetchCategories()
    emit('changed')
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to save category', toastType: 'error' })
  } finally {
    saving.value = false
  }
}

const deleteCategory = async (id?: string) => {
  if (!id || !confirm('Are you sure you want to delete this category?')) return
  try {
    await teams_api.$_delete_category(id)
    showToast({ title: 'Deleted', message: 'Category removed', toastType: 'success' })
    await fetchCategories()
    emit('changed')
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to delete category', toastType: 'error' })
  }
}
</script>
