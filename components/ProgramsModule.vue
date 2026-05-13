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
            <tr v-for="program in filteredPrograms" :key="program.id || program._id" class="group hover:bg-slate-50/50 transition-all duration-300">
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
                    @click="getRegistrationLink(program.id || program._id)"
                    class="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    title="Registration Gateway"
                  >
                    <Icon name="lucide:link" class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteProgram(program.id || program._id)"
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

    <!-- Program Gateway (Premium Sharing Experience) -->
    <Modal v-model="showLinkModal" title="Program Connectivity" size="md">
      <div v-if="registrationLink" class="p-0 overflow-hidden">
        <!-- Hero Header -->
        <div class="bg-[#033958] p-10 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <Icon name="lucide:link-2" class="w-32 h-32 text-white/5 absolute -top-8 -right-8 rotate-12" />
          
          <div class="relative z-10 space-y-4">
            <div class="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center mx-auto shadow-2xl">
              <Icon name="lucide:globe" class="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 class="text-2xl font-black text-white tracking-tighter">Gateway Activated</h3>
              <p class="text-blue-100/60 text-sm font-bold uppercase tracking-widest">Global enrollment ready</p>
            </div>
          </div>
        </div>

        <!-- Content Body -->
        <div class="p-10 space-y-10 bg-white">
          <div class="space-y-4">
            <div class="flex items-center justify-between px-1">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Enrollment URL</label>
              <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                HTTPS Secure
              </span>
            </div>
            
            <div class="group relative">
              <div class="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-all rounded-3xl"></div>
              <div class="relative flex items-center bg-slate-50 border border-slate-100 rounded-3xl p-2 pl-6 focus-within:border-blue-300 focus-within:bg-white transition-all shadow-inner">
                <span class="text-sm font-bold text-slate-400 select-none mr-2">/</span>
                <input
                  :value="registrationLink.split('/').pop()"
                  readonly
                  class="flex-1 bg-transparent border-none text-sm font-black text-[#033958] focus:ring-0 cursor-default truncate py-4"
                />
                <button
                  @click="copyToClipboard(registrationLink)"
                  class="px-6 py-4 bg-[#033958] text-white rounded-[1.2rem] font-bold text-xs hover:bg-[#022a41] transition-all active:scale-95 flex items-center gap-2 shadow-lg"
                >
                  <Icon :name="copiedLink ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
                  <span>{{ copiedLink ? 'Copied' : 'Copy' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Strategy Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-100 transition-all cursor-pointer">
              <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Icon name="lucide:qr-code" class="w-5 h-5" />
              </div>
              <h4 class="text-xs font-black text-slate-900 uppercase mb-1">Visual Entry</h4>
              <p class="text-[10px] text-slate-400 font-bold leading-tight">Generate QR asset for physical collateral</p>
            </div>
            <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-emerald-100 transition-all cursor-pointer">
              <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Icon name="lucide:mail" class="w-5 h-5" />
              </div>
              <h4 class="text-xs font-black text-slate-900 uppercase mb-1">Email Blast</h4>
              <p class="text-[10px] text-slate-400 font-bold leading-tight">Notify all qualified practitioners</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-6 border-t border-slate-50 flex items-center justify-between">
            <button 
              @click="showLinkModal = false"
              class="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
              Close Gateway
            </button>
            <a 
              :href="registrationLink" 
              target="_blank"
              class="text-xs font-black uppercase tracking-widest text-[#033958] flex items-center gap-2 hover:gap-3 transition-all"
            >
              Test Portal
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </a>
          </div>
        </div>
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
const copiedLink = ref(false)
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
      await updateProgram(selectedProgram.value.id || selectedProgram.value._id, programData)
      showToast({
        title: "Program Updated",
        message: "The program details have been successfully refined.",
        toastType: "success",
      })
    } else {
      const result = await createProgram(programData)
      if (result) {
        registrationLink.value = `https://www.medlabconvo.com/programs/${result.slug}/apply`
        showLinkModal.value = true
      }
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
    copiedLink.value = true
    showToast({
      title: "Gateway Copied",
      message: "The enrollment URL is ready for sharing.",
      toastType: "success",
      duration: 3000,
    })
    setTimeout(() => {
      copiedLink.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>