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

    <!-- Programs Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <div
        v-for="program in filteredPrograms"
        :key="program.id"
        class="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-[#033958]/20 hover: hover:[#033958]/5 transition-all duration-500"
      >
        <!-- Program Banner -->
        <div class="relative h-40 bg-slate-50 overflow-hidden">
          <div 
            class="absolute inset-0 bg-gradient-to-br from-[#033958]/5 to-transparent group-hover:scale-110 transition-transform duration-700"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <Icon name="lucide:graduation-cap" class="w-12 h-12 text-[#033958]/10 group-hover:text-[#033958]/20 transition-colors duration-500" />
          </div>
          
          <!-- Status Badge Overlay -->
          <div class="absolute top-4 left-4">
            <span :class="[
              'px-3 py-1.5 text-[10px] font-bold rounded-full backdrop-blur-md',
              program.status === 'active' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-200' : 
              program.status === 'inactive' ? 'bg-rose-500/10 text-rose-700 border border-rose-200' :
              'bg-slate-500/10 text-slate-700 border border-slate-200'
            ]">
              {{ program.status }}
            </span>
          </div>
        </div>
        
        <!-- Program Content -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-bold text-slate-400">{{ program.category || 'Course' }}</span>
            <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                @click="editProgram(program)"
                class="p-2 text-slate-400 hover:text-[#033958] hover:bg-[#033958]/5 rounded-lg transition-all"
              >
                <Icon name="lucide:pencil" class="w-4 h-4" />
              </button>
              <button
                @click="getRegistrationLink(program.id)"
                class="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                title="Registration Link"
              >
                <Icon name="lucide:link" class="w-4 h-4" />
              </button>
              <button
                @click="deleteProgram(program.id)"
                class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#033958] transition-colors duration-300 line-clamp-2 leading-tight">
            {{ program.title }}
          </h3>
          <p class="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed h-15">
            {{ program.description }}
          </p>
          
          <div class="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-slate-400">Duration</span>
              <span class="text-sm font-bold text-slate-700">{{ program.duration || 'Flexible' }}</span>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[10px] font-bold text-slate-400">Applicants</span>
              <span class="text-sm font-bold text-slate-700">{{ program.applicationsCount || 0 }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 text-slate-400">
              <Icon name="lucide:calendar" class="w-4 h-4" />
              <span class="text-sm font-bold">{{ formatDate(program.createdAt) }}</span>
            </div>
            <button 
              @click="editProgram(program)"
              class="text-[#033958] text-sm font-bold hover:underline decoration-2 underline-offset-4"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-[#033958] animate-spin"></div>
      </div>
      <span class="text-sm font-bold text-slate-400 animate-pulse">Fetching curriculum...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPrograms.length === 0" class="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
      <div class="w-20 h-20 bg-white rounded-2xl  flex items-center justify-center mb-6">
        <Icon name="lucide:graduation-cap" class="w-10 h-10 text-slate-300" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2">No programs found</h3>
      <p class="text-slate-500 mb-8 max-w-xs text-center leading-relaxed">Your educational portfolio is empty or doesn't match the search.</p>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold "
      >
        Launch New Program
      </button>
    </div>

    <!-- SlideOver for Edit/Create -->
    <SlideOver v-model="showModal" :title="selectedProgram ? 'Edit Program' : 'New Program'">
      <div class="p-8">
        <ProgramForm
          :program="selectedProgram"
          @save="handleSaveProgram"
          @cancel="closeModal"
        />
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
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Direct URL</label>
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
import Icon from '@/components/Icon.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Modal from '@/components/Modal.vue'

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
const showLinkModal = ref(false)
const selectedProgram = ref<any>(null)

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

const deleteProgram = async (programId: string) => {
  if (confirm('Are you sure you want to delete this program?')) {
    try {
      await softDeleteProgram(programId)
      await getPrograms()
    } catch (error) {
      console.error('Error deleting program:', error)
    }
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