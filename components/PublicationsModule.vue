<template>
    <div class="space-y-6">
      <!-- Header Actions -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search publications..."
            class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            v-model="statusFilter"
            class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          <span>New Publication</span>
        </button>
      </div>
  
      <!-- Publications List -->
      <div class="space-y-4">
        <div
          v-for="publication in filteredPublications"
          :key="publication._id"
          class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <h3 class="text-lg font-semibold text-slate-900">{{ publication.title }}</h3>
                <span :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  publication.status === 'published' ? 'bg-green-100 text-green-800' :
                  publication.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  publication.status === 'under-review' ? 'bg-yellow-100 text-yellow-800' :
                  publication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ publication.status }}
                </span>
              </div>
              
              <p class="text-slate-600 mb-3 line-clamp-2">{{ publication.abstract }}</p>
              
              <div class="flex items-center space-x-6 text-sm text-slate-500 mb-4">
                <div class="flex items-center space-x-1">
                  <Icon name="heroicons:user" class="w-4 h-4" />
                  <span>{{ publication?.authors }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Icon name="heroicons:calendar" class="w-4 h-4" />
                  <span>{{ formatDate(publication?.createdAt) }}</span>
                </div>
                <div v-if="publication.journal" class="flex items-center space-x-1">
                  <Icon name="heroicons:book-open" class="w-4 h-4" />
                  <span>{{ publication.journal }}</span>
                </div>
              </div>
              
              <div v-if="publication.keywords?.length" class="flex flex-wrap gap-2">
                <span
                  v-for="keyword in publication.keywords"
                  :key="keyword"
                  class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <button
                @click="editPublication(publication)"
                class="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50"
              >
                <Icon name="heroicons:pencil" class="w-4 h-4" />
              </button>
              
              <button
                v-if="publication.status === 'draft'"
                @click="submitForReview(publication._id)"
                class="text-yellow-600 hover:text-yellow-800 p-2 rounded hover:bg-yellow-50"
                title="Submit for Review"
              >
                <Icon name="heroicons:paper-airplane" class="w-4 h-4" />
              </button>
              
              <button
                v-if="publication.status === 'under-review'"
                @click="approvePublication(publication._id)"
                class="text-green-600 hover:text-green-800 p-2 rounded hover:bg-green-50"
                title="Approve"
              >
                <Icon name="heroicons:check" class="w-4 h-4" />
              </button>
              
              <button
                v-if="publication.status === 'approved'"
                @click="publishPublication(publication._id)"
                class="text-purple-600 hover:text-purple-800 p-2 rounded hover:bg-purple-50"
                title="Publish"
              >
                <Icon name="heroicons:eye" class="w-4 h-4" />
              </button>
              
              <button
                @click="deletePublication(publication._id)"
                class="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
  
      <!-- Empty State -->
      <div v-else-if="filteredPublications.length === 0" class="text-center py-12">
        <Icon name="heroicons:document-text" class="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p class="text-slate-500">No publications found</p>
      </div>
  
      <!-- Create/Edit Publication Modal -->
      <Modal v-model="showModal" title="Publication Details" size="xl">
        <PublicationForm
          :publication="selectedPublication"
          @save="handleSavePublication"
          @cancel="closeModal"
        />
      </Modal>
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
  const selectedPublication = ref(null)
  
  // Load publications on mount
  onMounted(() => {
    getPublications()
  })
  
  // Computed
  const filteredPublications = computed(() => {
    let filtered = publications.value
  
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(publication => 
        publication.title?.toLowerCase().includes(query) ||
        publication.abstract?.toLowerCase().includes(query) ||
        publication.authors?.some((author: string) => author.toLowerCase().includes(query))
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
      console.log(publicationData, 'pub data')
      if (selectedPublication.value) {
        await updatePublication(selectedPublication.value._id, publicationData)
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
    return new Date(date).toLocaleDateString()
  }
  </script>
  