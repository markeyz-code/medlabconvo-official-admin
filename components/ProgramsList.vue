<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <div class="flex-1 max-w-md">
          <AnimatedInput
            v-model="searchQuery"
            id="programSearch"
            label="Search programs"
            type="text"
          />
        </div>
        <div class="w-full sm:w-64">
          <SelectInput
            v-model="statusFilter"
            label="Filter by status"
            :options="[
              { label: 'All status', value: '' },
              { label: 'Draft', value: 'draft' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Completed', value: 'completed' }
            ]"
          />
        </div>
      </div>
      
      <button
        @click="openCreateModal"
        class="w-full sm:w-auto px-10 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#022f42] transition-all active:scale-95 flex items-center justify-center space-x-3"
      >
        <Plus class="w-4 h-4" />
        <span>Create Program</span>
      </button>
    </div>

    <!-- Programs List -->
    <div v-if="!loading && filteredPrograms.length > 0" class="space-y-4">
      <TransitionGroup
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-4"
        tag="div"
        class="space-y-4"
      >
        <div
          v-for="program in filteredPrograms"
          :key="program._id"
          class="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 group hover:border-[#033958]/20"
        >
          <div class="flex flex-col md:flex-row">
            <!-- Program Image -->
            <div class="relative w-full md:w-64 h-48 md:h-auto bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex-shrink-0">
              <img
                v-if="program.image"
                :src="program.image"
                :alt="program.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <GraduationCap class="w-16 h-16 text-slate-400 opacity-80" />
              </div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 left-4">
                <span
                  :class="[
                    'px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border',
                    getStatusColor(program.status)
                  ]"
                >
                  {{ formatStatus(program.status) }}
                </span>
              </div>

              <!-- Applications Count -->
              <div class="absolute bottom-4 left-4">
                <div class="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 font-bold">
                  <Users class="w-3.5 h-3.5" />
                  <span>{{ program.applicationsCount || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Program Content -->
            <div class="flex-1 p-8">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h3 class="font-bold text-xl text-slate-900 group-hover:text-slate-900 transition-colors mb-1 tracking-tight">
                    {{ program.title }}
                  </h3>
                  <p class="text-sm text-slate-400 font-bold uppercase tracking-widest">{{ program.category }}</p>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex items-center space-x-1 ml-4 text-slate-400 group-hover:text-slate-500 transition-colors">
                  <button
                    @click="viewProgram(program)"
                    class="p-2 hover:text-[#033958] hover:bg-slate-50 rounded-lg transition-all"
                    title="View details"
                  >
                    <Eye class="w-5 h-5" />
                  </button>
                  <button
                    @click="editProgram(program)"
                    class="p-2 hover:text-[#033958] hover:bg-slate-50 rounded-lg transition-all"
                    title="Edit program"
                  >
                    <Edit class="w-5 h-5" />
                  </button>
                  <button
                    @click="getRegistrationLink(program._id)"
                    class="p-2 hover:text-[#033958] hover:bg-slate-50 rounded-lg transition-all"
                    title="Copy registration link"
                  >
                    <Link class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDelete(program)"
                    class="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Delete program"
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p class="text-sm text-slate-600 mb-6 line-clamp-2 font-medium">
                {{ program.description }}
              </p>

              <!-- Program Details Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div class="flex items-center space-x-3">
                  <Clock class="w-4 h-4 text-slate-300" />
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                    <p class="font-bold text-slate-700 text-sm mt-0.5">{{ program.duration }}</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <Calendar class="w-4 h-4 text-slate-300" />
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created</p>
                    <p class="font-bold text-slate-700 text-sm mt-0.5 font-sans">{{ formatDate(program.createdAt) }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <FileText class="w-4 h-4 text-slate-300" />
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fields</p>
                    <p class="font-bold text-slate-700 text-sm mt-0.5">{{ program.formFields?.length || 0 }} total</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <Users class="w-4 h-4 text-slate-300" />
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applicants</p>
                    <p class="font-bold text-slate-700 text-sm mt-0.5">{{ program.applicationsCount || 0 }}</p>
                  </div>
                </div>
              </div>

              <!-- Focus Areas -->
              <div v-if="program.focusAreas?.length" class="flex items-center space-x-3 mb-4">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Focus:</span>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="area in program.focusAreas.slice(0, 4)"
                    :key="area"
                    class="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold border border-slate-100"
                  >
                    {{ area }}
                  </span>
                  <span
                    v-if="program.focusAreas.length > 4"
                    class="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-bold"
                  >
                    +{{ program.focusAreas.length - 4 }}
                  </span>
                </div>
              </div>

              <!-- Images Preview -->
              <div v-if="program.images?.length" class="flex items-center space-x-3">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gallery:</span>
                <div class="flex space-x-2">
                  <div
                    v-for="(image, index) in program.images.slice(0, 5)"
                    :key="index"
                    class="w-10 h-10 rounded-lg overflow-hidden border border-slate-100"
                  >
                    <img
                      :src="image"
                      :alt="`Program image ${Number(index) + 1}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-if="program.images.length > 5"
                    class="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold"
                  >
                    +{{ Number(program.images?.length || 0) - 5 }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin"></div>
        <p class="text-sm font-bold text-slate-400 mt-4 uppercase tracking-widest">Loading programs...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPrograms.length === 0" class="text-center py-24 bg-white rounded-3xl border border-slate-100">
      <div class="w-24 h-24 mx-auto mb-6 bg-slate-50 rounded-3xl flex items-center justify-center">
        <GraduationCap class="w-12 h-12 text-slate-200" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No programs found</h3>
      <p class="text-slate-400 text-sm font-medium mb-8 max-w-xs mx-auto">
        {{ searchQuery || statusFilter ? 'Try adjusting your search criteria or clear your filters.' : 'Your programs collection is currently empty.' }}
      </p>
      <button
        @click="openCreateModal"
        class="px-10 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#022f42] transition-all active:scale-95 flex items-center justify-center space-x-3 mx-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Create your first program</span>
      </button>
    </div>

    <!-- Modals -->
    <Modal v-model="showModal" title="Program management" size="xl" :close-on-outside="false">
      <ProgramForm
        :program="selectedProgram"
        @save="handleSaveProgram"
        @cancel="closeModal"
      />
    </Modal>

    <Modal v-model="showViewModal" title="Program details" size="xl">
      <ProgramView
        v-if="viewedProgram"
        :program="viewedProgram"
        @close="closeViewModal"
        @edit="editFromView"
      />
    </Modal>

    <Modal v-model="showLinkModal" title="Registration link" size="md">
      <div v-if="registrationLink" class="space-y-6 p-2">
        <div class="space-y-2">
          <label class="block text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Unique URL</label>
          <div class="flex items-center space-x-3">
            <input
              :value="registrationLink"
              readonly
              class="flex-1 px-4 py-4 border border-slate-100 rounded-xl bg-slate-50 text-sm font-medium text-slate-600 outline-none"
            />
            <button
              @click="copyToClipboard(registrationLink)"
              class="px-6 py-4 bg-[#033958] text-white rounded-xl hover:bg-[#022f42] transition-all flex items-center space-x-2 text-sm font-bold active:scale-95"
            >
              <Copy class="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>
        <div class="flex justify-end pt-4 border-t border-slate-50">
          <button
            @click="showLinkModal = false"
            class="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>

    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete program"
      :message="`Are you sure you want to delete '${programToDelete?.title}'? This action is permanent.`"
      confirm-text="Delete"
      confirm-class="bg-rose-600 hover:bg-rose-700"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Search, Plus, Eye, Edit, Link, Trash2, GraduationCap,
  Users, Clock, Calendar, FileText, Copy
} from 'lucide-vue-next'
import { useGetPrograms } from '@/composables/modules/programs/useGetPrograms'
import { useCreateProgram } from '@/composables/modules/programs/useCreateProgram'
import { useUpdateProgram } from '@/composables/modules/programs/useUpdateProgram'
import { useSoftDeleteProgram } from '@/composables/modules/programs/useSoftDeleteProgram'
import { useGetRegistrationLink } from '@/composables/modules/programs/useGetRegistrationLink'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'

// Composables
const { programs, loading, getPrograms } = useGetPrograms()
const { createProgram } = useCreateProgram()
const { updateProgram } = useUpdateProgram()
const { softDeleteProgram } = useSoftDeleteProgram()
const { registrationLink, getRegistrationLink: fetchRegistrationLink } = useGetRegistrationLink()

// State
const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const showViewModal = ref(false)
const showLinkModal = ref(false)
const showDeleteModal = ref(false)
const selectedProgram = ref<any>(null)
const viewedProgram = ref<any>(null)
const programToDelete = ref<any>(null)

// Hooks
onMounted(() => {
  getPrograms()
})

// Computed
const filteredPrograms = computed(() => {
  let filtered = (programs.value as any[]) || []
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(program =>
      program.title?.toLowerCase().includes(query) ||
      program.description?.toLowerCase().includes(query) ||
      program.category?.toLowerCase().includes(query)
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

const viewProgram = (program: any) => {
  viewedProgram.value = program
  showViewModal.value = true
}

const editFromView = (program: any) => {
  closeViewModal()
  editProgram(program)
}

const closeModal = () => {
  showModal.value = false
  selectedProgram.value = null
}

const closeViewModal = () => {
  showViewModal.value = false
  viewedProgram.value = null
}

const confirmDelete = (program: any) => {
  programToDelete.value = program
  showDeleteModal.value = true
}

const handleDeleteConfirm = async () => {
  if (programToDelete.value) {
    try {
      await softDeleteProgram(programToDelete.value._id)
      await getPrograms()
      showDeleteModal.value = false
      programToDelete.value = null
    } catch (error) {
      console.error('Error deleting program:', error)
    }
  }
}

const handleSaveProgram = async (programData: any) => {
  try {
    if (selectedProgram.value) {
      await updateProgram(selectedProgram.value._id, programData)
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

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Error copying to clipboard:', error)
  }
}

// Utils
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'draft': 'bg-slate-50 text-slate-500 border-slate-100',
    'active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'inactive': 'bg-rose-50 text-rose-600 border-rose-100',
    'completed': 'bg-blue-50 text-blue-600 border-blue-100'
  }
  return colors[status] || 'bg-slate-50 text-slate-500 border-slate-100'
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>