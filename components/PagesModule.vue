<template>
  <div class="space-y-10 animate-in fade-in duration-700">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div class="flex flex-col space-y-1">
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Website content</h2>
        <p class="text-sm font-bold text-slate-400">Manage static pages and website sections</p>
      </div>
      <button
        @click="openCreateModal"
        class="w-full sm:w-auto px-8 py-3.5 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all duration-300 flex items-center justify-center space-x-3 group"
      >
        <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span class="font-bold text-sm">Create page</span>
      </button>
    </div>

    <!-- Page Grid List -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="w-12 h-12 rounded-full border-4 border-slate-50 border-t-[#033958] animate-spin"></div>
      <p class="text-sm font-bold text-slate-400 animate-pulse">Loading content...</p>
    </div>

    <div v-else-if="cmsPages.length" class="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 border-b border-slate-100/50 hidden md:table-row">
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Page Identity</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Sections</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Environment</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Modified</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr 
            v-for="page in cmsPages" 
            :key="page.key" 
            class="group hover:bg-[#033958]/[0.02] transition-colors duration-300"
          >
            <!-- Page Identity -->
            <td class="px-6 py-5">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#033958]/40 group-hover:bg-[#033958]/10 group-hover:text-[#033958] transition-colors">
                  <Icon name="lucide:layout" class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 leading-tight group-hover:text-[#033958] transition-colors">{{ page.title }}</h3>
                  <span class="text-[10px] font-bold text-slate-400 mt-1 inline-block bg-slate-100 px-2 py-0.5 rounded">{{ page.key }}</span>
                </div>
              </div>
            </td>
            
            <!-- Sections -->
            <td class="px-6 py-5 hidden md:table-cell">
              <div class="flex items-center space-x-2">
                <Icon name="lucide:layers" class="w-4 h-4 text-slate-300" />
                <span class="text-sm font-bold text-slate-600">{{ page.data?.sections?.length || 0 }}</span>
              </div>
            </td>

            <!-- Environment (Currently always active) -->
            <td class="px-6 py-5 hidden md:table-cell">
              <span class="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>Production</span>
              </span>
            </td>

            <!-- Last Modified -->
            <td class="px-6 py-5 hidden md:table-cell">
              <span class="text-xs font-semibold text-slate-400">{{ new Date(page.updatedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-5">
              <div class="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button @click="openEditModal(page)" class="p-2.5 text-slate-400 hover:text-[#033958] hover:bg-[#033958]/10 rounded-xl transition-all" title="Edit Content">
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
                <button @click="handleDeleteConfirm(page.key)" class="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete Page">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
      <div class="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6">
        <Icon name="lucide:layout" class="w-12 h-12 text-slate-100" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 tracking-tight">No pages found</h3>
      <p class="text-sm text-slate-500 mb-8 max-w-sm text-center leading-relaxed font-medium">Create a new page to manage its content and sections.</p>
      <button
        @click="openCreateModal"
        class="px-10 py-4 bg-[#033958] text-white rounded-2xl hover:bg-[#022a41] transition-all font-bold text-sm"
      >
        Create first page
      </button>
    </div>

    <!-- Slide-over for Edit/Create -->
    <SlideOver v-model="isSlideOverOpen" :title="isEditing ? 'Edit page' : 'Create page'" size="lg">
      <div class="p-8 pb-32">
        <form @submit.prevent="handleSubmit" class="space-y-10">
          <!-- Identity Section -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-[#033958] px-1">Page details</h4>
            <div class="space-y-4">
              <AnimatedInput
                v-model="form.key"
                id="pageKey"
                label="Page unique key"
                type="text"
                :disabled="isEditing"
                required
                position="top"
              />
              <AnimatedInput
                v-model="form.title"
                id="pageTitle"
                label="Page title"
                type="text"
                required
                position="bottom"
              />
            </div>
          </div>

          <!-- Sections Management -->
          <div class="space-y-6">
            <div class="flex items-center justify-between px-1">
              <h4 class="text-sm font-bold text-[#033958]">Page sections</h4>
              <button type="button" @click="addSection" class="text-[#033958] text-sm font-bold hover:underline decoration-2 underline-offset-4">Add section</button>
            </div>

            <div v-if="form.data.sections.length === 0" class="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p class="text-sm font-bold text-slate-400">No sections added</p>
            </div>

            <div v-for="(section, index) in form.data.sections" :key="index" class="group relative bg-[#1A1A1B05] rounded-[32px] p-8 border border-slate-100 hover:border-[#033958]/20 transition-all duration-300">
              <!-- Inline Controls -->
              <div class="absolute -top-3 right-6 flex items-center bg-white rounded-xl border border-slate-100 p-1">
                <button type="button" @click="removeSection(index)" class="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <AnimatedInput v-model="section.id" :id="'sec-id-'+index" label="Section identifier" type="text" />
                <AnimatedInput v-model="section.title" :id="'sec-title-'+index" label="Section title" type="text" />
                <div class="flex items-center gap-4">
                  <div class="flex-1">
                    <AnimatedInput v-model="section.order" :id="'sec-order-'+index" label="Order" type="number" />
                  </div>
                  <label class="flex items-center group cursor-pointer pt-4">
                    <div class="relative flex items-center justify-center w-5 h-5 rounded border-2 border-slate-300 group-hover:border-[#033958] transition-colors">
                      <input type="checkbox" v-model="section.isVisible" class="absolute opacity-0 w-full h-full cursor-pointer z-10" />
                      <div v-if="section.isVisible" class="w-2.5 h-2.5 bg-[#033958] rounded-sm"></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <AnimatedInput v-model="section.content" :id="'sec-content-'+index" label="Section content" type="textarea" :rows="6" />
            </div>
          </div>

          <!-- Submission Layer -->
          <div class="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-end gap-4 z-20">
            <button type="button" @click="closeSlideOver" class="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
            <button type="submit" :disabled="isSaving" class="px-12 py-3 bg-[#033958] text-white text-sm font-bold rounded-xl hover:bg-[#022a41] transition-all active:scale-95 disabled:opacity-50 inline-flex items-center space-x-3">
              <div v-if="isSaving" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>{{ isEditing ? 'Save changes' : 'Create page' }}</span>
            </button>
          </div>
        </form>
      </div>
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGetCms } from '@/composables/modules/cms/useGetCms'
import { useUpsertCms } from '@/composables/modules/cms/useUpsertCms'
import { useDeleteCms } from '@/composables/modules/cms/useDeleteCms'
import { useCustomToast } from '@/composables/core/useCustomToast'
import type { CmsDocument, UpsertCmsPayload } from '@/api_factory/modules/cms'
import Icon from '@/components/Icon.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import SlideOver from '@/components/SlideOver.vue'

const { loading, cmsPages, getAllCms } = useGetCms()
const { loading: isSaving, upsertCms } = useUpsertCms()
const { deleteCms } = useDeleteCms()
const { showToast } = useCustomToast()

const isSlideOverOpen = ref(false)
const isEditing = ref(false)

const form = ref<UpsertCmsPayload>({
  key: '',
  title: '',
  data: { sections: [] }
})

onMounted(() => {
  getAllCms()
})

const openCreateModal = () => {
  isEditing.value = false
  form.value = { key: '', title: '', data: { sections: [] } }
  isSlideOverOpen.value = true
}

const openEditModal = (page: CmsDocument) => {
  isEditing.value = true
  form.value = {
    key: page.key,
    title: page.title,
    data: { sections: JSON.parse(JSON.stringify(page.data?.sections || [])) }
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
    showToast({ title: 'Success', message: 'Page updated successfully', toastType: 'success' })
    closeSlideOver()
    getAllCms()
  } catch (err) {
    console.error(err)
  }
}

const handleDeleteConfirm = async (key: string) => {
  if (confirm('Are you sure you want to delete this page?')) {
    try {
      await deleteCms(key)
      showToast({ title: 'Removed', message: 'Page successfully deleted', toastType: 'success' })
      getAllCms()
    } catch (err) {
      console.error(err)
    }
  }
}
</script>
