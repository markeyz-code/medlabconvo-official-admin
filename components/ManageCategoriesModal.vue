<template>
  <Modal v-model="modelValue" title="Manage Publication Categories" size="lg">
    <div class="space-y-6">
      <!-- Create New Category -->
      <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-end gap-4">
        <div class="flex-1">
          <AnimatedInput
            v-model="newCategory.name"
            id="new-category-name"
            label="Category Name"
            placeholder="e.g., Clinical Research"
            required
          />
        </div>
        <button
          @click="handleCreate"
          :disabled="creating || !newCategory.name"
          class="px-6 py-3 bg-[#033958] text-white rounded-xl font-bold text-sm hover:bg-[#022a41] disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Icon v-if="creating" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else name="lucide:plus" class="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <!-- Categories List -->
      <div class="border rounded-2xl overflow-hidden bg-white">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b">
              <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Category Name</th>
              <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-1/3"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-8 ml-auto"></div></td>
            </tr>
            <tr v-else-if="categories.length === 0">
              <td colspan="2" class="px-6 py-10 text-center text-slate-400 text-sm">No categories defined yet.</td>
            </tr>
            <tr v-for="cat in categories" :key="cat._id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-sm font-medium text-slate-700">{{ cat.name }}</td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="deleteCategory(cat._id)"
                  class="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                  title="Remove category"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategories } from '@/composables/modules/publications/useCategories'
import Modal from '@/components/Modal.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import Icon from '@/components/Icon.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const { categories, loading, getCategories, createCategory, deleteCategory } = useCategories()

const newCategory = ref({ name: '', description: '' })
const creating = ref(false)

onMounted(() => {
  getCategories()
})

const handleCreate = async () => {
  creating.value = true
  const res = await createCategory(newCategory.value)
  if (res) {
    newCategory.value.name = ''
  }
  creating.value = false
}
</script>
