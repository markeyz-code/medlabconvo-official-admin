<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <div class="relative w-full sm:w-auto">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            v-model="searchQuery"
            type="text"
           
            class="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white "
          />
        </div>
        <div class="w-full sm:w-48">
          <SelectInput
            v-model="statusFilter"
            label="Status"
            :options="[
              { label: 'All Status', value: '' },
              { label: 'Draft', value: 'draft' },
              { label: 'Under Review', value: 'under-review' },
              { label: 'Approved', value: 'approved' },
              { label: 'Published', value: 'published' },
              { label: 'Rejected', value: 'rejected' }
            ]"
          />
        </div>
      </div>
      <button
        @click="openCreateModal"
        class="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2  hover: transform hover:-translate-y-0.5"
      >
        <Plus class="w-5 h-5" />
        <span>New Publication</span>
      </button>
    </div>

    <!-- Reorder Loading Indicator -->
    <div v-if="reorderLoading" class="flex items-center justify-center py-4">
      <div class="flex items-center space-x-2 text-amber-600">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent"></div>
        <span class="text-sm font-medium">Reordering publications...</span>
      </div>
    </div>

    <!-- Publications Grid -->
    <div v-if="!loading && filteredPublications.length > 0" class="grid gap-6">
      <draggable
        v-model="localPublications"
        item-key="_id"
        :disabled="!!searchQuery || !!statusFilter || reorderLoading"
        handle=".drag-handle"
        ghost-class="opacity-50"
        @end="handleDragEnd"
        class="space-y-4"
      >
        <template #item="{ element: publication, index }">
          <div
            :class="[
              'bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300 group relative',
              {
                'cursor-move': !searchQuery && !statusFilter,
                'cursor-not-allowed opacity-60': reorderLoading
              }
            ]"
          >
            <!-- Mobile/Desktop Drag Handle -->
            <div 
              v-if="!searchQuery && !statusFilter" 
              class="drag-handle absolute left-2 top-1/2 transform -translate-y-1/2 p-2 cursor-move text-slate-300 hover:text-amber-500 transition-colors"
            >
              <GripVertical class="w-5 h-5" />
            </div>

            <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4" :class="{ 'ml-8': !searchQuery && !statusFilter }">
              <!-- Main Content -->
              <div class="flex-1 space-y-4">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h3 class="text-base font-semibold text-slate-900 group-hover:text-amber-700 transition-colors duration-200">
                    {{ publication.title }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <span
                      :class="['px-3 py-1 text-xs font-semibold rounded-full w-fit', getStatusColor(publication.status)]"
                    >
                      {{ formatStatus(publication.status) }}
                    </span>
                    <span v-if="publication.position" class="text-[10px] text-slate-400 font-mono">Pos: {{ publication.position }}</span>
                  </div>
                </div>
              
              <!-- Abstract -->
              <p class="text-slate-600 text-sm leading-relaxed line-clamp-3">
                {{ publication.abstract }}
              </p>
              
              <!-- Metadata -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div class="flex items-center space-x-2">
                  <User class="w-4 h-4" />
                  <span>{{ publication.authors }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Calendar class="w-4 h-4" />
                  <span>{{ publication.year || formatDate(publication.createdAt) }}</span>
                </div>
                <div v-if="publication.journal" class="flex items-center space-x-2">
                  <BookOpen class="w-4 h-4" />
                  <span>{{ publication.journal }}</span>
                </div>
                <div v-if="publication.category" class="flex items-center space-x-2">
                  <Tag class="w-4 h-4" />
                  <span>{{ publication.category }}</span>
                </div>
              </div>
              
              <!-- Images Preview -->
              <div v-if="publication.images?.length" class="flex space-x-2">
                <div
                  v-for="(image, imageIndex) in publication.images.slice(0, 3)"
                  :key="imageIndex"
                  class="w-16 h-16 rounded-lg overflow-hidden border-2 border-slate-200"
                >
                  <img
                    :src="getImageUrl(image)"
                    :alt="`Publication image ${imageIndex + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-if="publication.images.length > 3"
                  class="w-16 h-16 rounded-lg bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-500 text-sm font-medium"
                >
                  +{{ publication.images.length - 3 }}
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex lg:flex-col items-center lg:items-end gap-2">
              <!-- Reorder Buttons (Mobile Friendly) -->
              <div v-if="!searchQuery && !statusFilter" class="flex lg:flex-col gap-1 mr-2 lg:mr-0 border-r lg:border-r-0 lg:border-b border-slate-100 pr-2 lg:pr-0 pb-0 lg:pb-2">
                <button
                  @click="moveItem(index, 'up')"
                  :disabled="index === 0 || reorderLoading"
                  class="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-30 transition-all"
                  title="Move Up"
                >
                  <ChevronUp class="w-5 h-5" />
                </button>
                <button
                  @click="moveItem(index, 'down')"
                  :disabled="index === localPublications.length - 1 || reorderLoading"
                  class="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-30 transition-all"
                  title="Move Down"
                >
                  <ChevronDown class="w-5 h-5" />
                </button>
              </div>

              <!-- Preview Button -->
              <button
                @click="previewPublication(publication)"
                class="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group/btn"
                title="Preview"
              >
                <Eye class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
              
              <!-- Edit Button -->
              <button
                @click="editPublication(publication)"
                class="p-2.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200 group/btn"
                title="Edit"
              >
                <Edit class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
              
              <!-- Status Action Buttons -->
              <button
                v-if="publication.status === 'draft'"
                @click="submitForReview(publication._id)"
                class="p-2.5 text-slate-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all duration-200 group/btn"
                title="Submit for Review"
              >
                <Send class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
              
              <button
                v-if="publication.status === 'pending_review'"
                @click="approvePublication(publication._id)"
                class="p-2.5 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 group/btn"
                title="Approve"
              >
                <Check class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
              
              <button
                v-if="publication.status === 'approved'"
                @click="publishPublication(publication._id)"
                class="p-2.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 group/btn"
                title="Publish"
              >
                <Globe class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
              
              <!-- Delete Button -->
              <button
                @click="confirmDelete(publication)"
                class="p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/btn"
                title="Delete"
              >
                <Trash2 class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="relative">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-200"></div>
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPublications.length === 0" class="text-center py-16">
      <div class="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
        <FileText class="w-12 h-12 text-slate-400" />
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-2">No publications found</h3>
      <p class="text-slate-500 mb-6">
        {{ searchQuery || statusFilter ? 'Try adjusting your search or filters' : 'Get started by creating your first publication' }}
      </p>
      <button
        v-if="!searchQuery && !statusFilter"
        @click="openCreateModal"
        class="px-6 py-3 bg-primary text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 inline-flex items-center space-x-2"
      >
        <Plus class="w-5 h-5" />
        <span>Create Publication</span>
      </button>
    </div>

    <!-- Reorder Error Toast -->
    <div
      v-if="reorderError"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg  z-50 flex items-center space-x-2"
    >
      <span>{{ reorderError }}</span>
      <button @click="resetReorderState" class="text-white hover:text-red-200">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Reorder Success Toast -->
    <div
      v-if="reorderSuccess"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg  z-50 flex items-center space-x-2"
    >
      <span>Publications reordered successfully!</span>
      <button @click="resetReorderState" class="text-white hover:text-green-200">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Modals -->
    <Modal v-model="showModal" title="Publication Details" size="xl">
      <PublicationForm
        :publication="selectedPublication"
        :loading="selectedPublication ? updating : creating"
        @save="handleSavePublication"
        @cancel="closeModal"
      />
    </Modal>

    <Modal v-model="showPreviewModal" title="Publication Preview" size="xl">
      <PublicationPreview
        v-if="previewedPublication"
        :publication="previewedPublication"
        @close="closePreviewModal"
      />
    </Modal>

    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete Publication"
      :message="`Are you sure you want to delete '${publicationToDelete?.title}'? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { 
  Search, Plus, Eye, Edit, Send, Check, Globe, Trash2, 
  User, Calendar, BookOpen, Tag, FileText, X,
  GripVertical, ChevronUp, ChevronDown 
} from 'lucide-vue-next'
import { useGetPublications } from '@/composables/modules/publications/useGetPublications'
import { useCreatePublication } from '@/composables/modules/publications/useCreatePublication'
import { useUpdatePublication } from '@/composables/modules/publications/useUpdatePublication'
import { useSubmitForReview } from '@/composables/modules/publications/useSubmitPublicationForReview'
import { useApprovePublication } from '@/composables/modules/publications/useApprovePublication'
import { usePublishPublication } from '@/composables/modules/publications/usePublishPublication'
import { useSoftDeletePublication } from '@/composables/modules/publications/useSoftDeletePublication'
import { useReorderPublication } from '@/composables/modules/publications/useReorderPublication'

// Composables
const { publications, loading, getPublications } = useGetPublications()
const { createPublication, loading: creating } = useCreatePublication()
const { updatePublication, loading: updating } = useUpdatePublication()
const { submitForReview: submitForReviewAction } = useSubmitForReview()
const { approvePublication: approvePublicationAction } = useApprovePublication()
const { publishPublication: publishPublicationAction } = usePublishPublication()
const { softDeletePublication } = useSoftDeletePublication()
const { 
  loading: reorderLoading, 
  error: reorderError, 
  success: reorderSuccess, 
  reorderFromSortedArray,
  resetState: resetReorderState
} = useReorderPublication()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const showPreviewModal = ref(false)
const showDeleteModal = ref(false)
const selectedPublication = ref(null)
const previewedPublication = ref(null)
const publicationToDelete = ref(null)

// Drag and drop state
const localPublications = ref([])

// Load publications on mount
onMounted(async () => {
  await getPublications()
  localPublications.value = [...filteredPublications.value]
})

// Sync local state when source data changes
watch(publications, (newVal) => {
  if (newVal) {
    localPublications.value = [...filteredPublications.value]
  }
}, { deep: true })

// Computed
const filteredPublications = computed(() => {
  let filtered = publications.value || []
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(publication => 
      publication.title?.toLowerCase().includes(query) ||
      publication.abstract?.toLowerCase().includes(query) ||
      publication.authors?.toLowerCase().includes(query) ||
      publication.journal?.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(publication => publication.status === statusFilter.value)
  }
  
  // Respect the position field if available, otherwise fallback to date
  return [...filtered].sort((a: any, b: any) => {
    if (a.position !== undefined && b.position !== undefined && a.position !== b.position) {
      return a.position - b.position
    }
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })
})

// Drag and Drop Methods
const handleDragEnd = async () => {
  if (reorderLoading.value) return

  try {
    // Call the reorder API with the new order in localPublications
    await reorderFromSortedArray(localPublications.value)
    
    // Refresh to ensure everything is in sync
    await getPublications()
    
    // Success message auto-hide
    setTimeout(() => {
      resetReorderState()
    }, 3000)
  } catch (error) {
    console.error('Error reordering publications:', error)
    // Revert local state on error
    localPublications.value = [...filteredPublications.value]
    setTimeout(() => {
      resetReorderState()
    }, 5000)
  }
}

const moveItem = async (index: number, direction: 'up' | 'down') => {
  if (reorderLoading.value) return
  
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= localPublications.value.length) return
  
  // Swap items
  const items = [...localPublications.value]
  const temp = items[index]
  items[index] = items[newIndex]
  items[newIndex] = temp
  
  localPublications.value = items
  await handleDragEnd()
}

// Existing Methods
const openCreateModal = () => {
  selectedPublication.value = null
  showModal.value = true
}

const editPublication = (publication: any) => {
  selectedPublication.value = publication
  showModal.value = true
}

const previewPublication = (publication: any) => {
  previewedPublication.value = publication
  showPreviewModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPublication.value = null
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewedPublication.value = null
}

const confirmDelete = (publication: any) => {
  publicationToDelete.value = publication
  showDeleteModal.value = true
}

const handleDeleteConfirm = async () => {
  if (publicationToDelete.value) {
    try {
      await softDeletePublication(publicationToDelete.value._id)
      await getPublications()
      showDeleteModal.value = false
      publicationToDelete.value = null
    } catch (error) {
      console.error('Error deleting publication:', error)
    }
  }
}

const handleSavePublication = async (publicationData: any) => {
  try {
    if (selectedPublication.value) {
      const { doiLink, doi, link, ...rest } = publicationData
      await updatePublication(selectedPublication.value._id, rest)
    } else {
      const payload = {
        title: publicationData.title,
        abstract: publicationData.abstract,
        authors: publicationData.authors,
        journal: publicationData.journal,
        year: publicationData.year,
        doi: publicationData.pubLink,
        link: publicationData.pubLink,
        pubLink: publicationData.pubLink,
        doiLink: publicationData.pubLink,
        category: publicationData.category,
        images: publicationData.images
      };

      await createPublication(payload)
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

const rejectPublication = async (publicationId: string) => {
  // Implement reject functionality if needed
  console.log('Reject publication:', publicationId)
}

// Utility functions
const getStatusColor = (status: string) => {
  const colors = {
    'published': 'bg-green-100 text-green-800',
    'approved': 'bg-blue-100 text-blue-800',
    'under-review': 'bg-yellow-100 text-yellow-800',
    'rejected': 'bg-red-100 text-red-800',
    'draft': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatStatus = (status: string) => {
  return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getImageUrl = (image: string) => {
  if (image.startsWith('http')) {
    return image
  }
  return `/api/images/${image}`
}
</script>
