<template>
  <div class="space-y-6">
    <!-- Header/Form Area -->
    <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <h3 class="text-lg font-medium text-slate-900 mb-4">{{ editingId ? 'Edit Category' : 'Create New Category' }}</h3>
      <form @submit.prevent="saveCategory" class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
          <AnimatedInput
            v-model="form.name"
            id="categoryName"
            label="Category Name"
            type="text"
            required
          />
        </div>
        <div class="w-full sm:w-32">
          <AnimatedInput
            v-model="form.position"
            id="categoryPosition"
            label="Order"
            type="number"
            required
          />
        </div>
        <div class="flex gap-2">
          <button v-if="editingId" type="button" @click="resetForm" class="px-4 py-3 bg-white text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium">
            Cancel
          </button>
          <button type="submit" :disabled="saving" class="px-6 py-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all font-medium disabled:opacity-50 whitespace-nowrap text-sm">
            {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>

    <!-- List Area -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden relative min-h-[200px]">
      <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
         <div class="w-8 h-8 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-2"></div>
      </div>
      
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100">
            <th class="px-6 py-4 text-sm font-medium text-slate-500">Category Name</th>
            <th class="px-6 py-4 text-sm font-medium text-slate-500 text-center">Order</th>
            <th class="px-6 py-4 text-sm font-medium text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="category in categories" :key="category._id" class="group hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4 font-medium text-slate-900">{{ category.name }}</td>
            <td class="px-6 py-4 text-center text-slate-500">{{ category.position }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button @click="editCategory(category)" class="p-2 text-[#033958] hover:bg-[#033958]/10 rounded-lg border border-transparent hover:border-[#033958]/20 transition-all" title="Edit">
                  <Icon name="lucide:square-pen" class="w-4 h-4" />
                </button>
                <button @click="deleteCategory(category._id)" class="p-2 text-rose-500 hover:bg-rose-100 rounded-lg border border-transparent hover:border-rose-200 transition-all" title="Delete">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && categories.length === 0">
            <td colspan="3" class="px-6 py-8 text-center text-slate-500">No categories found.</td>
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
