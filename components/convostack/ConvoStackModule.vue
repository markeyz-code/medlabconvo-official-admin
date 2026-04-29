<template>
  <div class="space-y-10 animate-in fade-in duration-700">
    <!-- Header Actions -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
        <div class="w-full sm:w-80">
          <AnimatedInput
            v-model="searchQuery"
            id="search-convostack"
            label="Search publications..."
            type="text"
          />
        </div>
        <div class="w-full sm:w-52">
          <SelectInput
            v-model="statusFilter"
            :options="[
              { label: 'All Status', value: '' },
              { label: 'Draft', value: 'draft' },
              { label: 'In Review', value: 'in_review' },
              { label: 'Published', value: 'published' },
              { label: 'Archived', value: 'archived' }
            ]"
          />
        </div>
      </div>
      <button
        @click="openEditor(null)"
        class="w-full lg:w-auto px-8 py-3.5 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all duration-300 flex items-center justify-center space-x-3 group"
      >
        <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span class="font-bold text-sm">New publication</span>
      </button>
    </div>

    <!-- Premium Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in convoStats" :key="stat.title" class="group bg-white p-6 rounded-3xl border border-slate-100 flex items-center space-x-5">
        <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500', stat.bg]">
          <Icon :name="stat.icon" :class="['w-7 h-7', stat.color]" />
        </div>
        <div>
          <p class="text-sm font-bold text-slate-400 mb-1">{{ stat.title }}</p>
          <p class="text-2xl font-bold text-slate-900 leading-none">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Publications Table -->
    <div v-if="!loading && filteredPublications.length > 0" class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/50">
            <th class="px-6 py-4 text-xs font-semibold text-slate-500">Publication</th>
            <th class="px-4 py-4 text-xs font-semibold text-slate-500">Status</th>
            <th class="px-4 py-4 text-xs font-semibold text-slate-500 hidden lg:table-cell">Author</th>
            <th class="px-4 py-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Metrics</th>
            <th class="px-4 py-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Date</th>
            <th class="px-4 py-4 text-xs font-semibold text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="pub in filteredPublications" :key="pub._id" class="hover:bg-slate-50/50 transition-colors group">
            <!-- Publication Info -->
            <td class="px-6 py-4">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                  <img v-if="pub.coverImage" :src="pub.coverImage" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Icon name="lucide:file-text" class="w-5 h-5 text-slate-300" />
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-900 truncate max-w-[280px]">{{ pub.title }}</p>
                  <p class="text-xs text-slate-400 truncate max-w-[280px] mt-0.5">{{ pub.excerpt }}</p>
                </div>
              </div>
            </td>
            <!-- Status -->
            <td class="px-4 py-4">
              <span :class="[
                'px-2.5 py-1 text-sm font-semibold rounded-full capitalize',
                pub.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                pub.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                pub.status === 'in_review' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                'bg-slate-50 text-slate-600 border border-slate-200'
              ]">
                {{ pub.status?.replace('_', ' ') }}
              </span>
            </td>
            <!-- Author -->
            <td class="px-4 py-4 hidden lg:table-cell">
              <div class="flex items-center space-x-2">
                <div class="w-7 h-7 rounded-full bg-[#033958] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {{ pub.authorName?.charAt(0) || 'M' }}
                </div>
                <span class="text-xs font-medium text-slate-600">{{ pub.authorName || 'Unknown' }}</span>
              </div>
            </td>
            <!-- Metrics -->
            <td class="px-4 py-4 hidden md:table-cell">
              <div class="flex items-center space-x-3 text-xs text-slate-500">
                <span class="flex items-center space-x-1"><Icon name="lucide:eye" class="w-3.5 h-3.5 text-slate-300" /><span>{{ pub.viewCount || 0 }}</span></span>
                <span class="flex items-center space-x-1"><Icon name="lucide:heart" class="w-3.5 h-3.5 text-slate-300" /><span>{{ pub.likesCount || 0 }}</span></span>
                <span class="flex items-center space-x-1"><Icon name="lucide:message-square" class="w-3.5 h-3.5 text-slate-300" /><span>{{ pub.commentsCount || 0 }}</span></span>
              </div>
            </td>
            <!-- Date -->
            <td class="px-4 py-4 hidden md:table-cell">
              <span class="text-xs font-medium text-slate-400">{{ formatDate(pub.createdAt) }}</span>
            </td>
            <!-- Actions -->
            <td class="px-4 py-4">
              <div class="flex items-center justify-end space-x-1">
                <button @click="openComments(pub)" class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all relative group/commentbtn" title="View comments">
                  <Icon name="lucide:message-square" class="w-4 h-4" />
                  <span v-if="pub.commentsCount > 0" class="absolute top-0 right-0 -mt-1 -mr-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </button>
                <button @click="openEditor(pub)" class="p-2 text-slate-400 hover:text-[#033958] hover:bg-[#033958]/5 rounded-lg transition-all" title="Edit">
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
                <button @click="copyPublicLink(pub)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Copy link">
                  <Icon name="lucide:link" class="w-4 h-4" />
                </button>
                <button @click="confirmDelete(pub)" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="w-12 h-12 rounded-full border-4 border-slate-50 border-t-[#033958] animate-spin"></div>
      <p class="text-sm font-bold text-slate-400 animate-pulse">Loading publications...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPublications.length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200">
      <div class="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
        <Icon name="lucide:sparkles" class="w-12 h-12 text-slate-200" />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 tracking-tight">No publications found</h3>
      <p class="text-sm text-slate-500 mb-8 max-w-sm text-center leading-relaxed">Your publication archive is currently empty. Start by creating your first post.</p>
      <button
        @click="openEditor(null)"
        class="px-10 py-4 bg-[#033958] text-white rounded-2xl hover:bg-[#022a41] transition-all font-bold text-sm"
      >
        Create first publication
      </button>
    </div>


    <!-- Delete Confirmation -->
    <Modal v-model="showDeleteModal" title="Archive Purge Confirmation" size="sm">
      <div class="p-8 text-center space-y-6">
        <div class="w-20 h-20 bg-red-50 rounded-[30px] flex items-center justify-center mx-auto text-red-500">
          <Icon name="lucide:trash-2" class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">Purge publication?</h3>
          <p class="text-sm text-slate-500 mt-2 leading-relaxed">This will permanently remove <span class="font-bold text-slate-900">"{{ deletingPublication?.title }}"</span> from the Convo Stack registry.</p>
        </div>
        <div class="flex items-center gap-4 pt-6 border-t border-slate-50">
          <button @click="showDeleteModal = false" class="flex-1 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Safe Abort</button>
          <button @click="handleDelete" class="flex-1 py-4 bg-red-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-red-700  -600/20">Purge Record</button>
        </div>
      </div>
    </Modal>

    <!-- Comments Sliding Drawer -->
    <Teleport to="body">
      <Transition
        enter-active-class="transform transition ease-in-out duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition ease-in-out duration-200"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div v-if="showCommentsModal" class="fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col border-l border-slate-100">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 class="text-lg font-bold text-slate-900 tracking-tight">Reader Comments</h2>
              <p class="text-xs font-semibold text-slate-400 mt-1 truncate max-w-[280px]">On: {{ selectedPublicationForComments?.title }}</p>
            </div>
            <button @click="closeComments" class="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto bg-slate-50/30 p-6">
            <div v-if="commentsLoading" class="flex flex-col items-center justify-center h-full space-y-3">
               <div class="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#033958] animate-spin"></div>
               <span class="text-xs font-bold text-slate-400">Loading discourse...</span>
            </div>
            
            <div v-else-if="comments.length === 0" class="flex flex-col items-center justify-center h-full text-center px-4">
              <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Icon name="lucide:message-circle" class="w-8 h-8 text-slate-300" />
              </div>
              <h4 class="text-base font-bold text-slate-700">No Comments Yet</h4>
              <p class="text-xs text-slate-400 font-medium mt-1">This publication hasn't sparked any discourse.</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="(comment, index) in comments" :key="index" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#033958] to-[#0a527c] text-white flex items-center justify-center text-xs font-bold shadow-inner">
                      {{ comment.authorName?.charAt(0) || 'U' }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-900 leading-none">{{ comment.authorName || 'Unknown User' }}</p>
                      <p class="text-sm font-semibold text-slate-400 mt-1">{{ formatDateTime(comment.createdAt) }}</p>
                    </div>
                  </div>
                </div>
                <div class="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap pl-11">{{ comment.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <Transition
        enter-active-class="transition-opacity ease-linear duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-linear duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCommentsModal" @click="closeComments" class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetConvoStacks } from '@/composables/modules/convostack/useGetConvoStacks'
import { useCreateConvoStack } from '@/composables/modules/convostack/useCreateConvoStack'
import { useUpdateConvoStack } from '@/composables/modules/convostack/useUpdateConvoStack'
import { useDeleteConvoStack } from '@/composables/modules/convostack/useDeleteConvoStack'
import { useUpdatePublication } from "@/composables/modules/publications/useUpdatePublication"
import { useRouter } from '#imports'
import { useGetConvoStackComments } from '@/composables/modules/convostack/useGetConvoStackComments'
import { useCustomToast } from '@/composables/core/useCustomToast'
import Modal from '@/components/Modal.vue'
import Icon from '@/components/Icon.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'

const { publications, loading, getPublications } = useGetConvoStacks()
const { getComments, comments, loading: commentsLoading } = useGetConvoStackComments()
const { createPublication } = useCreateConvoStack()
const { updatePublication } = useUpdatePublication()
const { deletePublication } = useDeleteConvoStack()
const { showToast } = useCustomToast()

const router = useRouter()
const searchQuery = ref('')
const statusFilter = ref('')
const showDeleteModal = ref(false)
const deletingPublication = ref<any>(null)

const showCommentsModal = ref(false)
const selectedPublicationForComments = ref<any>(null)

onMounted(() => {
  getPublications()
})

const convoStats = computed(() => [
  { title: 'Total publications', value: publications.value?.length || 0, icon: 'lucide:terminal', color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Live records', value: (publications.value || []).filter((p: any) => p.status === 'published').length, icon: 'lucide:badge-check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'In incubation', value: (publications.value || []).filter((p: any) => p.status === 'draft').length, icon: 'lucide:beaker', color: 'text-amber-600', bg: 'bg-amber-50' },
  { title: 'Total views', value: (publications.value || []).reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0), icon: 'lucide:signal', color: 'text-indigo-600', bg: 'bg-indigo-50' }
])

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
  return [...filtered].sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
})

const openEditor = (pub: any) => {
  if (pub && pub.slug) {
    router.push(`/dashboard/convostack/${pub.slug}`)
  } else {
    router.push('/dashboard/convostack/create')
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
    showToast({ title: 'System Clipboard', message: 'Hyperlink synced successfully', toastType: 'success' })
  } catch { /* fallback */ }
}

const openComments = async (pub: any) => {
  selectedPublicationForComments.value = pub
  showCommentsModal.value = true
  if (pub._id) {
    await getComments(pub._id)
  }
}

const closeComments = () => {
  showCommentsModal.value = false
  setTimeout(() => {
    selectedPublicationForComments.value = null
  }, 300)
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatDateTime = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
