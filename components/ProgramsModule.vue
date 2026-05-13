<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div class="w-full sm:w-72">
          <AnimatedInput
            v-model="searchQuery"
            id="search-programs"
            label="Search programs..."
            type="text"
          />
        </div>
        <div class="w-full sm:w-48">
          <SelectInput
            v-model="statusFilter"
            :options="[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Draft', value: 'draft' }
            ]"
          />
        </div>
      </div>
      <button
        @click="openCreateModal"
        class="w-full md:w-auto px-6 py-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all duration-300 flex items-center justify-center space-x-3  hover: group"
      >
        <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span class="font-bold text-sm">New program</span>
      </button>
    </div>

    <!-- Programs Registry (Table Layout) -->
    <div v-if="!loading && filteredPrograms.length > 0" class="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm relative">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr class="bg-slate-50/50 text-sm font-black uppercase tracking-widest text-slate-400">
              <th class="px-8 py-6 border-b border-slate-100">Image</th>
              <th class="px-8 py-6 border-b border-slate-100">Program Identity</th>
              <th class="px-8 py-6 border-b border-slate-100">Status</th>
              <th class="px-8 py-6 border-b border-slate-100 text-center">Applicants</th>
              <th class="px-8 py-6 border-b border-slate-100">Duration</th>
              <th class="px-8 py-6 border-b border-slate-100">Created At</th>
              <th class="px-8 py-6 border-b border-slate-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="program in filteredPrograms" :key="program.id" class="group hover:bg-slate-50/50 transition-all duration-300">
              <!-- Program Image -->
              <td class="px-8 py-6">
                <div class="relative w-16 h-12 rounded-xl overflow-hidden shadow-sm ring-2 ring-slate-100 group-hover:ring-blue-100 transition-all">
                  <img 
                    :src="program.image || '/placeholder-program.jpg'" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Program Thumbnail"
                  />
                  <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </td>

              <!-- Program Identity -->
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-900 leading-none mb-1 group-hover:text-[#033958] transition-colors line-clamp-1">
                    {{ program.title }}
                  </span>
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ program.category || 'General' }}</span>
                </div>
              </td>

              <!-- Status -->
              <td class="px-8 py-6">
                <span :class="[
                  'inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ring-1 ring-inset',
                  program.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-500/20' : 'bg-amber-50 text-amber-700 ring-amber-500/20'
                ]">
                  {{ program.status }}
                </span>
              </td>

              <!-- Applicants -->
              <td class="px-8 py-6 text-center">
                <div class="inline-flex flex-col items-center">
                  <span class="text-sm font-black text-[#033958]">{{ program.applicationsCount || 0 }}</span>
                  <span class="text-[10px] font-bold text-slate-400">Total</span>
                </div>
              </td>

              <!-- Duration -->
              <td class="px-8 py-6 text-sm font-bold text-slate-600">
                {{ program.duration || 'Flexible' }}
              </td>

              <!-- Created At -->
              <td class="px-8 py-6">
                <span class="text-xs font-bold text-slate-400">{{ formatDate(program.createdAt) }}</span>
              </td>

              <!-- Actions -->
              <td class="px-8 py-6">
                <div class="flex items-center justify-end space-x-1">
                  <button
                    @click="previewProgram(program)"
                    class="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Quick Preview"
                  >
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </button>
                  <button
                    @click="editProgram(program)"
                    class="p-2.5 text-slate-400 hover:text-[#033958] hover:bg-[#033958]/5 rounded-xl transition-all"
                    title="Edit Program"
                  >
                    <Icon name="lucide:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    @click="getRegistrationLink(program.id)"
                    class="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    title="Registration Gateway"
                  >
                    <Icon name="lucide:link" class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteProgram(program.id)"
                    class="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Permanently"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
      <div class="relative w-14 h-14">
        <div class="absolute inset-0 rounded-full border-4 border-slate-50"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-[#033958] animate-spin"></div>
      </div>
      <span class="text-sm font-black uppercase tracking-widest text-slate-400 animate-pulse">Synchronizing curricula...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPrograms.length === 0" class="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
      <div class="w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-8">
        <Icon name="lucide:graduation-cap" class="w-10 h-10 text-slate-100" />
      </div>
      <h3 class="text-2xl font-black text-[#033958] mb-2 tracking-tighter">No Programs Found</h3>
      <p class="text-slate-400 mb-10 max-w-sm text-center leading-relaxed font-bold text-sm">Your educational portfolio is currently empty. Start by launching your first scientific curriculum.</p>
      <button
        @click="openCreateModal"
        class="px-10 py-4 bg-[#033958] text-white rounded-2xl hover:bg-[#022a41] transition-all font-bold text-sm shadow-xl active:scale-95"
      >
        Launch New Program
      </button>
    </div>

    <!-- SlideOver for Edit/Create -->
    <SlideOver v-model="showModal" size="full" :title="selectedProgram ? 'Edit Program' : 'New Program'">
      <ProgramForm
        :program="selectedProgram"
        @save="handleSaveProgram"
        @cancel="closeModal"
      />
    </SlideOver>

    <!-- SlideOver for Preview -->
    <SlideOver v-model="showPreviewModal" size="full" title="Program Intelligence Preview">
      <div class="p-10">
        <ProgramPreview :program="previewingProgram" />
      </div>
    </SlideOver>

    <!-- Registration Link Modal (Custom Premium Style) -->
    <Modal v-model="showLinkModal" title="Program Gateway" size="md">
      <div v-if="registrationLink" class="p-8 space-y-6">
        <div class="flex flex-col items-center text-center space-y-2">
          <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-2">
            <Icon name="lucide:link" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-900">Registration Link Generated</h3>
          <p class="text-sm text-slate-500">Share this link with potential applicants to let them apply for this program.</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Direct URL</label>
          <div class="flex items-center space-x-2">
            <input
              :value="registrationLink"
              readonly
              class="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600 focus:outline-none"
            />
            <button
              @click="copyToClipboard(registrationLink)"
              class="p-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all "
              title="Copy"
            >
              <Icon name="lucide:copy" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          @click="showLinkModal = false"
          class="w-full py-4 text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors border-t border-slate-50 pt-6"
        >
          Dismiss
        </button>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete Program"
      message="Are you sure you want to delete this program? This action cannot be undone."
      confirmText="Yes, Delete Program"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetPrograms } from '@/composables/modules/programs/useGetPrograms'
import { useCreateProgram } from '@/composables/modules/programs/useCreateProgram'
import { useUpdateProgram } from '@/composables/modules/programs/useUpdateProgram'
import { useSoftDeleteProgram } from '@/composables/modules/programs/useSoftDeleteProgram'
import { useGetRegistrationLink } from '@/composables/modules/programs/useGetRegistrationLink'
import { useCustomToast } from '@/composables/core/useCustomToast'
import SlideOver from '@/components/SlideOver.vue'
import ProgramForm from '@/components/ProgramForm.vue'
import ProgramPreview from '@/components/ProgramPreview.vue'
import Icon from '@/components/Icon.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Modal from '@/components/Modal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

// Composables
const { programs, loading, getPrograms } = useGetPrograms()
const { createProgram } = useCreateProgram()
const { updateProgram } = useUpdateProgram()
const { softDeleteProgram } = useSoftDeleteProgram()
const { registrationLink, getRegistrationLink: fetchRegistrationLink } = useGetRegistrationLink()
const { showToast } = useCustomToast()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const showPreviewModal = ref(false)
const previewingProgram = ref<any>(null)
const showLinkModal = ref(false)
const selectedProgram = ref<any>(null)
const showDeleteModal = ref(false)
const idToDelete = ref('')

// Load programs on mount
onMounted(() => {
  getPrograms()
})

// Computed
const filteredPrograms = computed(() => {
  let filtered = (programs.value || []) as any[]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(program => 
      program.title?.toLowerCase().includes(query) ||
      program.description?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(program => program.status === statusFilter.value)
  }

  return filtered
})

// Methods
const openCreateModal = () => {
  selectedProgram.value = null
  showModal.value = true
}

const editProgram = (program: any) => {
  selectedProgram.value = program
  showModal.value = true
}

const previewProgram = (program: any) => {
  previewingProgram.value = program
  showPreviewModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProgram.value = null
}

const handleSaveProgram = async (programData: any) => {
  try {
    if (selectedProgram.value) {
      await updateProgram(selectedProgram.value.id, programData)
    } else {
      await createProgram(programData)
    }
    await getPrograms()
    closeModal()
  } catch (error) {
    console.error('Error saving program:', error)
  }
}

const getRegistrationLink = async (programId: string) => {
  try {
    await fetchRegistrationLink(programId)
    showLinkModal.value = true
  } catch (error) {
    console.error('Error getting registration link:', error)
  }
}

const deleteProgram = (programId: string) => {
  idToDelete.value = programId
  showDeleteModal.value = true
}

const executeDelete = async () => {
  try {
    await softDeleteProgram(idToDelete.value)
    await getPrograms()
  } catch (error) {
    console.error('Error deleting program:', error)
  } finally {
    showDeleteModal.value = false
    idToDelete.value = ''
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast({ title: "Copied", message: "Registration link copied to clipboard", toastType: "success" })
  } catch (error) {
    console.error('Error copying to clipboard:', error)
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>