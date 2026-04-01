<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center space-x-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search publications..."
          class="px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm w-64"
        />
        <select
          v-model="statusFilter"
          class="px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="in_review">In Review</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <button
        @click="openEditor(null)"
        class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-indigo-200 font-semibold text-sm"
      >
        <Icon name="heroicons:plus" class="w-4 h-4" />
        <span>New Publication</span>
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div class="text-2xl font-extrabold text-slate-900">{{ publications.length }}</div>
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Posts</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div class="text-2xl font-extrabold text-green-600">{{ publishedCount }}</div>
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Published</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div class="text-2xl font-extrabold text-amber-600">{{ draftCount }}</div>
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Drafts</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div class="text-2xl font-extrabold text-indigo-600">{{ totalViews }}</div>
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Views</div>
      </div>
    </div>

    <!-- Publications Grid -->
    <div v-if="!loading && filteredPublications.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="pub in filteredPublications"
        :key="pub._id"
        class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
      >
        <!-- Cover Image -->
        <div class="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
          <img
            v-if="pub.coverImage"
            :src="pub.coverImage"
            :alt="pub.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon name="heroicons:document-text" class="w-16 h-16 text-indigo-300" />
          </div>
          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span :class="[
              'px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-sm',
              pub.status === 'published' ? 'bg-green-500/90 text-white' :
              pub.status === 'draft' ? 'bg-amber-500/90 text-white' :
              pub.status === 'in_review' ? 'bg-blue-500/90 text-white' :
              'bg-slate-500/90 text-white'
            ]">{{ pub.status?.replace('_', ' ') }}</span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <h3 class="font-bold text-slate-900 text-lg leading-snug mb-2 line-clamp-2">{{ pub.title }}</h3>
          <p class="text-sm text-slate-500 line-clamp-2 mb-4">{{ pub.excerpt }}</p>

          <!-- Metrics -->
          <div class="flex items-center space-x-4 text-sm text-slate-400 mb-4">
            <div class="flex items-center space-x-1">
              <Icon name="heroicons:eye" class="w-4 h-4" />
              <span>{{ pub.viewCount || 0 }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Icon name="heroicons:heart" class="w-4 h-4" />
              <span>{{ pub.likesCount || 0 }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Icon name="heroicons:chat-bubble-left" class="w-4 h-4" />
              <span>{{ pub.commentsCount || 0 }}</span>
            </div>
            <div class="flex items-center space-x-1 ml-auto text-xs">
              <Icon name="heroicons:clock" class="w-3.5 h-3.5" />
              <span>{{ pub.readTime || 0 }} min</span>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="pub.tags?.length" class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="tag in pub.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[11px] font-semibold rounded-full"
            >{{ tag }}</span>
            <span v-if="pub.tags.length > 3" class="px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] font-semibold rounded-full">+{{ pub.tags.length - 3 }}</span>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-slate-100">
            <div class="text-xs text-slate-400">
              <span class="font-medium text-slate-600">{{ pub.authorName }}</span>
              <span class="mx-1">·</span>
              <span>{{ formatDate(pub.createdAt) }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <button
                @click="openEditor(pub)"
                class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Edit"
              >
                <Icon name="heroicons:pencil" class="w-4 h-4" />
              </button>
              <button
                @click="copyPublicLink(pub)"
                class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                title="Copy Public Link"
              >
                <Icon name="heroicons:link" class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(pub)"
                class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Delete"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPublications.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
      <div class="w-20 h-20 bg-indigo-50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
        <Icon name="heroicons:book-open" class="w-10 h-10 text-indigo-400" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2">No publications yet</h3>
      <p class="text-slate-500 mb-6 max-w-md mx-auto">Create your first Convo Stack publication and start sharing your content with the world.</p>
      <button
        @click="openEditor(null)"
        class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg shadow-indigo-200"
      >
        Create First Publication
      </button>
    </div>

    <!-- Editor Modal (Full-Screen Slide-Over) -->
    <Teleport to="body">
      <Transition name="slide">
        <div v-if="showEditor" class="fixed inset-0 z-50 flex">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeEditor"></div>
          <!-- Editor Panel -->
          <div class="relative ml-auto w-full max-w-5xl bg-white shadow-2xl overflow-y-auto">
            <ConvoStackEditor
              :publication="selectedPublication"
              @save="handleSave"
              @cancel="closeEditor"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation -->
    <Modal v-model="showDeleteModal" title="Delete Publication" size="sm">
      <div class="p-4 text-center">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Are you sure?</h3>
        <p class="text-slate-500 mb-6">This will permanently delete "<strong>{{ deletingPublication?.title }}</strong>" and all its comments.</p>
        <div class="grid grid-cols-2 gap-3">
          <button @click="showDeleteModal = false" class="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold text-sm">Cancel</button>
          <button @click="handleDelete" class="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold text-sm">Delete</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetConvoStacks } from '@/composables/modules/convostack/useGetConvoStacks'
import { useCreateConvoStack } from '@/composables/modules/convostack/useCreateConvoStack'
import { useUpdateConvoStack } from '@/composables/modules/convostack/useUpdateConvoStack'
import { useDeleteConvoStack } from '@/composables/modules/convostack/useDeleteConvoStack'
import { useCustomToast } from '@/composables/core/useCustomToast'
import ConvoStackEditor from './ConvoStackEditor.vue'

const { publications, loading, getPublications } = useGetConvoStacks()
const { createPublication } = useCreateConvoStack()
const { updatePublication } = useUpdateConvoStack()
const { deletePublication } = useDeleteConvoStack()
const { showToast } = useCustomToast()

const searchQuery = ref('')
const statusFilter = ref('')
const showEditor = ref(false)
const selectedPublication = ref<any>(null)
const showDeleteModal = ref(false)
const deletingPublication = ref<any>(null)

onMounted(() => {
  getPublications()
})

// Computed
const filteredPublications = computed(() => {
  let filtered = publications.value || []
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter((p: any) =>
      p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q) || p.authorName?.toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) {
    filtered = filtered.filter((p: any) => p.status === statusFilter.value)
  }
  return filtered
})

const publishedCount = computed(() => (publications.value || []).filter((p: any) => p.status === 'published').length)
const draftCount = computed(() => (publications.value || []).filter((p: any) => p.status === 'draft').length)
const totalViews = computed(() => (publications.value || []).reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0))

// Methods
const openEditor = (pub: any) => {
  selectedPublication.value = pub ? { ...pub } : null
  showEditor.value = true
}

const closeEditor = () => {
  showEditor.value = false
  selectedPublication.value = null
}

const handleSave = async (payload: any) => {
  try {
    if (selectedPublication.value?._id) {
      const cleanPayload = { ...payload }
      delete cleanPayload._id
      delete cleanPayload.__v
      delete cleanPayload.createdAt
      delete cleanPayload.updatedAt
      delete cleanPayload.viewCount
      delete cleanPayload.likesCount
      delete cleanPayload.commentsCount
      await updatePublication(selectedPublication.value._id, cleanPayload)
    } else {
      await createPublication(payload)
    }
    await getPublications()
    closeEditor()
  } catch (err) {
    console.error('Save failed:', err)
  }
}

const confirmDelete = (pub: any) => {
  deletingPublication.value = pub
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deletingPublication.value?._id) return
  try {
    await deletePublication(deletingPublication.value._id)
    await getPublications()
    showDeleteModal.value = false
    deletingPublication.value = null
  } catch (err) {
    console.error('Delete failed:', err)
  }
}

const copyPublicLink = async (pub: any) => {
  const url = `https://www.medlabconvo.com/convostack/${pub.slug}`
  try {
    await navigator.clipboard.writeText(url)
    showToast({ title: 'Copied', message: 'Public link copied to clipboard', toastType: 'success', duration: 2000 })
  } catch { /* fallback */ }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; }
.slide-enter-from .relative, .slide-leave-to .relative { transform: translateX(100%); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
