<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div class="w-full sm:w-72">
          <AnimatedInput
            v-model="searchQuery"
            id="search-publications"
            label="Search publications"
            type="text"
          />
        </div>
        <div class="w-full sm:w-48">
          <SelectInput
            v-model="statusFilter"
            label="Filter status"
            :options="[
              { label: 'All status', value: '' },
              { label: 'Draft', value: 'draft' },
              { label: 'Pending review', value: 'pending_review' },
              { label: 'Approved', value: 'approved' },
              { label: 'Published', value: 'published' },
              { label: 'Rejected', value: 'rejected' }
            ]"
          />
        </div>
      </div>
      <button
        @click="openCreateModal"
        class="w-full md:w-auto px-6 py-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all duration-300 flex items-center justify-center space-x-3 group"
      >
        <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span class="font-bold text-sm">New publication</span>
      </button>
    </div>

    <!-- Publications List -->
    <div class="space-y-6">
      <div
        v-for="publication in filteredPublications"
        :key="publication.id"
        class="group bg-white rounded-2xl border border-slate-100 p-8 hover:border-[#033958]/10 transition-all duration-500 relative"
      >
        <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div class="flex-1 space-y-4">
            <div class="flex flex-wrap items-center gap-3">
              <span :class="[
                'px-3 py-1.5 text-[10px] font-bold rounded-full border',
                publication.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                publication.status === 'approved' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                publication.status === 'pending_review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                publication.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                'bg-slate-50 text-slate-500 border-slate-100'
              ]">
                {{ publication.status?.replace('_', ' ') }}
              </span>
              <span class="text-[10px] font-bold text-slate-400">{{ publication.category || 'Scientific Paper' }}</span>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 group-hover:text-[#033958] transition-colors duration-300 leading-tight tracking-tight">
              {{ publication.title }}
            </h3>
            
            <p class="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
              {{ publication.abstract }}
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Icon name="lucide:user" class="w-4 h-4" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-bold text-slate-400">Authors</span>
                  <span class="text-sm font-bold text-slate-700">{{ publication.authors }}</span>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Icon name="lucide:book-open" class="w-4 h-4" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-bold text-slate-400">Journal</span>
                  <span class="text-sm font-bold text-slate-700">{{ publication.journal || 'Universal Archive' }}</span>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Icon name="lucide:calendar" class="w-4 h-4" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-bold text-slate-400">Date</span>
                  <span class="text-sm font-bold text-slate-700 font-sans tracking-tight">{{ formatDate(publication.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex lg:flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-slate-400">
            <button
              @click="editPublication(publication)"
              class="p-2 hover:text-[#033958] hover:bg-slate-50 rounded-xl transition-all"
              title="Edit"
            >
              <Icon name="lucide:pencil" class="w-5 h-5" />
            </button>
            
            <button
              v-if="publication.status === 'draft'"
              @click="submitForReview(publication.id)"
              class="p-2 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
              title="Submit for review"
            >
              <Icon name="lucide:send" class="w-5 h-5" />
            </button>
            
            <button
              v-if="publication.status === 'pending_review'"
              @click="approvePublication(publication.id)"
              class="p-2 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              title="Approve"
            >
              <Icon name="lucide:check" class="w-5 h-5" />
            </button>
            
            <button
              v-if="publication.status === 'approved'"
              @click="publishPublication(publication.id)"
              class="p-2 hover:text-[#033958] hover:bg-slate-50 rounded-xl transition-all"
              title="Publish"
            >
              <Icon name="lucide:upload-cloud" class="w-5 h-5" />
            </button>
            
            <button
              @click="deletePublication(publication.id)"
              class="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Delete"
            >
              <Icon name="lucide:trash-2" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="w-12 h-12 border-4 border-slate-50 border-t-[#033958] rounded-full animate-spin"></div>
      <span class="text-sm font-bold text-slate-400 animate-pulse">Loading publications...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPublications.length === 0" class="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
      <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
        <Icon name="lucide:beaker" class="w-10 h-10 text-slate-100" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No publications found</h3>
      <p class="text-slate-500 mb-8 max-w-xs text-center leading-relaxed font-medium">Your research archive is currently empty. Start by adding a new publication.</p>
      <button
        @click="openCreateModal"
        class="px-8 py-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all font-bold text-sm"
      >
        Add publication
      </button>
    </div>

    <!-- SlideOver for Edit/Create -->
    <SlideOver v-model="showModal" :title="selectedPublication ? 'Edit publication' : 'New publication'">
      <div class="p-8">
        <PublicationForm
          :publication="selectedPublication"
          @save="handleSavePublication"
          @cancel="closeModal"
        />
      </div>
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetPublications } from '@/composables/modules/publications/useGetPublications'
import { useCreatePublication } from '@/composables/modules/publications/useCreatePublication'
import { useUpdatePublication } from '@/composables/modules/publications/useUpdatePublication'
import { useSubmitForReview } from '@/composables/modules/publications/useSubmitPublicationForReview'
import { useApprovePublication } from '@/composables/modules/publications/useApprovePublication'
import { usePublishPublication } from '@/composables/modules/publications/usePublishPublication'
import { useSoftDeletePublication } from '@/composables/modules/publications/useSoftDeletePublication'
import SlideOver from '@/components/SlideOver.vue'
import PublicationForm from '@/components/PublicationForm.vue'
import Icon from '@/components/Icon.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Modal from '@/components/Modal.vue'

// Composables
const { publications, loading, getPublications } = useGetPublications()
const { createPublication } = useCreatePublication()
const { updatePublication } = useUpdatePublication()
const { submitForReview: submitForReviewAction } = useSubmitForReview()
const { approvePublication: approvePublicationAction } = useApprovePublication()
const { publishPublication: publishPublicationAction } = usePublishPublication()
const { softDeletePublication } = useSoftDeletePublication()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const selectedPublication = ref<any>(null)

// Load publications on mount
onMounted(() => {
  getPublications()
})

// Computed
const filteredPublications = computed(() => {
  let filtered = (publications.value || []) as any[]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(publication => 
      publication.title?.toLowerCase().includes(query) ||
      publication.abstract?.toLowerCase().includes(query) ||
      publication.authors?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(publication => publication.status === statusFilter.value)
  }

  return filtered
})

// Methods
const openCreateModal = () => {
  selectedPublication.value = null
  showModal.value = true
}

const editPublication = (publication: any) => {
  selectedPublication.value = publication
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPublication.value = null
}

const handleSavePublication = async (publicationData: any) => {
  try {
    if (selectedPublication.value) {
      await updatePublication(selectedPublication.value.id, publicationData)
    } else {
      await createPublication(publicationData)
    }
    await getPublications()
    closeModal()
  } catch (error) {
    console.error('Error saving publication:', error)
  }
}

const submitForReview = async (publicationId: string) => {
  try {
    await submitForReviewAction(publicationId)
    await getPublications()
  } catch (error) {
    console.error('Error submitting for review:', error)
  }
}

const approvePublication = async (publicationId: string) => {
  try {
    await approvePublicationAction(publicationId)
    await getPublications()
  } catch (error) {
    console.error('Error approving publication:', error)
  }
}

const publishPublication = async (publicationId: string) => {
  try {
    await publishPublicationAction(publicationId)
    await getPublications()
  } catch (error) {
    console.error('Error publishing publication:', error)
  }
}

const deletePublication = async (publicationId: string) => {
  if (confirm('Are you sure you want to delete this publication?')) {
    try {
      await softDeletePublication(publicationId)
      await getPublications()
    } catch (error) {
      console.error('Error deleting publication:', error)
    }
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>