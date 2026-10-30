<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div class="w-full sm:w-72">
          <AnimatedInput
            v-model="filters.search"
            @input="handleSearch"
            id="search-programs"
            label="Search programs..."
            type="text"
          />
        </div>
        <div class="w-full sm:w-48">
          <SelectInput
            v-model="filters.status"
            @change="handleFilter"
            :options="[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Draft', value: 'draft' }
            ]"
          />
        </div>
        <div class="w-full sm:w-48">
          <SelectInput
            v-model="filters.category"
            @change="handleFilter"
            :options="[
              { label: 'All Categories', value: '' },
              { label: 'Healthcare', value: 'Healthcare' },
              { label: 'Education', value: 'Education' },
              { label: 'Technology Training', value: 'Technology Training' },
              { label: 'Business Development', value: 'Business Development' },
              { label: 'General', value: 'General' }
            ]"
          />
        </div>
      </div>
      <button v-if="hasPermission('programs:create')"
        @click="openCreateModal"
        class="w-full md:w-auto px-6 py-3 bg-[#27628C] text-white rounded-xl hover:bg-[#1B4A6B] transition-all duration-300 flex items-center justify-center space-x-3  hover: group"
      >
        <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span class="font-bold text-sm">New program</span>
      </button>
    </div>

    <!-- Programs Registry (Table Layout) -->
    <div v-if="!loading && programs.length > 0" class="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm relative">
      <div class="overflow-x-auto">
        <table class="admin-table stack-table w-full text-left border-separate border-spacing-0">
          <thead>
            <tr class="bg-slate-50/50 text-sm font-black  tracking-normal text-slate-400">
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
            <tr v-for="program in programs" :key="program.id || program._id" class="group hover:bg-slate-50/50 transition-all duration-300">
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
                  <span class="text-sm font-bold text-slate-900 leading-none mb-1 group-hover:text-[#27628C] transition-colors line-clamp-1">
                    {{ program.title }}
                  </span>
                  <span class="text-sm font-black  tracking-normal text-slate-400">{{ program.category || 'General' }}</span>
                </div>
              </td>

              <!-- Status -->
              <td class="px-8 py-6">
                <span :class="[
                  'inline-flex items-center px-3 py-1 text-sm font-black  tracking-normal rounded-full ring-1 ring-inset',
                  program.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-500/20' : 'bg-amber-50 text-amber-700 ring-amber-500/20'
                ]">
                  {{ program.status }}
                </span>
              </td>

              <!-- Applicants -->
              <td class="px-8 py-6 text-center">
                <div class="inline-flex flex-col items-center">
                  <span class="text-sm font-black text-[#27628C]">{{ program.applicationsCount || 0 }}</span>
                  <span class="text-sm font-bold text-slate-400">Total</span>
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
                  <button v-if="hasPermission('programs:update')"
                    @click="editProgram(program)"
                    class="p-2.5 text-slate-400 hover:text-[#27628C] hover:bg-[#27628C]/5 rounded-xl transition-all"
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
                  <button v-if="hasPermission('programs:delete')"
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


    <!-- Pagination -->
    <div v-if="!loading && metadata.pages > 1" class="flex items-center justify-between mt-6 px-4">
      <span class="text-sm text-slate-500 font-medium">Showing page {{ metadata.page }} of {{ metadata.pages }} ({{ metadata.total }} total)</span>
      <div class="flex items-center space-x-2">
        <button 
          @click="setPage(metadata.page - 1)" 
          :disabled="metadata.page === 1"
          class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Icon name="lucide:chevron-left" class="w-4 h-4" />
        </button>
        <button 
          @click="setPage(metadata.page + 1)" 
          :disabled="metadata.page === metadata.pages"
          class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <AdminTableLoading card v-if="loading" :columns="7" :rows="5" label="Loading programmes" />

    <AdminEmptyState
        card
      v-else-if="programs.length === 0"
      icon="lucide:graduation-cap"
      title="No programmes found"
      description="Your educational portfolio is empty. Start by launching your first programme."
    >
      <button v-if="hasPermission('programs:create')" class="btn btn-primary" @click="openCreateModal">
        <Icon name="lucide:plus" class="w-4 h-4" />
        Launch new programme
      </button>
    </AdminEmptyState>

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

    <!-- Registration link -->
    <Modal v-model="showLinkModal" title="Registration link" eyebrow="Programme" description="Share this secure link with applicants." size="md">
      <div v-if="registrationLink" class="space-y-4">
        <div class="flex items-start gap-3 rounded-lg border border-[#e0e9ef] bg-[#f4f8fb] p-3.5">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#27628C] text-white"><Icon name="lucide:globe" class="h-4 w-4" /></span>
          <div>
            <p class="text-[11px] font-semibold text-[#0A202B]">Registration is live</p>
            <p class="mt-0.5 text-[10.5px] leading-5 text-slate-500">Anyone with this link can open and submit the application form.</p>
          </div>
        </div>
        <div>
          <label class="field-label">Secure enrollment URL</label>
          <div class="flex items-stretch gap-2">
            <input :value="registrationLink" readonly class="input min-w-0 flex-1 font-mono text-[11px]" />
            <button type="button" class="btn btn-primary shrink-0" @click="copyToClipboard(registrationLink)">
              <Icon :name="copiedLink ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5" />
              {{ copiedLink ? 'Copied' : 'Copy' }}
            </button>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <button type="button" class="btn btn-outline" @click="showLinkModal = false">Close</button>
          <a :href="registrationLink" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Open registration <Icon name="lucide:arrow-up-right" class="h-3.5 w-3.5" />
          </a>
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
import AdminEmptyState from '@/components/AdminEmptyState.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'
import { useUser } from '@/composables/modules/auth/user'

const { hasPermission } = useUser()

// Composables
const { programs, loading, getPrograms, metadata, filters, setPage } = useGetPrograms()
const { createProgram } = useCreateProgram()
const { updateProgram } = useUpdateProgram()
const { softDeleteProgram } = useSoftDeleteProgram()
const { registrationLink, getRegistrationLink: fetchRegistrationLink } = useGetRegistrationLink()
const { showToast } = useCustomToast()

// Reactive data

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

// Filter handling with debounce for search
let searchTimeout: any = null
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    metadata.value.page = 1
    getPrograms()
  }, 500)
}

const handleFilter = () => {
  metadata.value.page = 1
  getPrograms()
}

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

const handleSaveProgram = async (programData: any, done?: () => void) => {
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
  } finally {
    if (done) done()
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