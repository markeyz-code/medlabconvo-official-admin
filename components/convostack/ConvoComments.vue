<script setup lang="ts">
import { convostack_api } from '@/api_factory/modules/convostack'
import Modal from '@/components/Modal.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'
import AdminEmptyState from '@/components/AdminEmptyState.vue'

const comments = ref<any[]>([])
const publications = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const filter = ref<'all' | 'pending' | 'approved'>('all')
const showDelete = ref(false)
const deleting = ref<any>(null)

const load = async () => {
  loading.value = true
  try {
    const [commentsRes, publicationsRes] = await Promise.all([
      convostack_api.$_get_all_comments(),
      convostack_api.$_get_publications(),
    ])
    comments.value = commentsRes.data || []
    publications.value = publicationsRes.data || []
  } catch (error) {
    console.error('Failed to load comments', error)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const publicationMap = computed(() => {
  const map = new Map<string, any>()
  publications.value.forEach((p: any) => map.set(String(p._id), p))
  return map
})

const filtered = computed(() => {
  let list = comments.value
  if (filter.value === 'pending') list = list.filter((c: any) => !c.isApproved)
  if (filter.value === 'approved') list = list.filter((c: any) => c.isApproved)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter((c: any) =>
      c.content?.toLowerCase().includes(q) ||
      c.userName?.toLowerCase().includes(q) ||
      c.userEmail?.toLowerCase().includes(q) ||
      publicationMap.value.get(String(c.publicationId))?.title?.toLowerCase().includes(q))
  }
  return [...list].sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
})

const pendingCount = computed(() => comments.value.filter((c: any) => !c.isApproved).length)
const approvedCount = computed(() => comments.value.filter((c: any) => c.isApproved).length)

const toggleApproval = async (comment: any) => {
  const next = !comment.isApproved
  await convostack_api.$_set_comment_approval(comment._id, next)
  comment.isApproved = next
}

const confirmDelete = (comment: any) => {
  deleting.value = comment
  showDelete.value = true
}

const handleDelete = async () => {
  if (!deleting.value) return
  await convostack_api.$_delete_comment(deleting.value._id)
  comments.value = comments.value.filter((c: any) => c._id !== deleting.value._id)
  showDelete.value = false
  deleting.value = null
}

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const postLink = (comment: any) => {
  const post = publicationMap.value.get(String(comment.publicationId))
  return post ? `https://www.medlabconvo.com/convostack/${post.slug}` : '#'
}
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-100 bg-white p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Total comments</p>
        <p class="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-900">{{ comments.length }}</p>
        <p class="mt-1 text-[10px] text-slate-400">Across every published post</p>
      </div>
      <div class="rounded-2xl border border-slate-100 bg-white p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Approved</p>
        <p class="mt-2 text-2xl font-bold tracking-[-0.04em] text-emerald-600">{{ approvedCount }}</p>
        <p class="mt-1 text-[10px] text-slate-400">Visible to readers</p>
      </div>
      <div class="rounded-2xl border border-slate-100 bg-white p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Awaiting review</p>
        <p class="mt-2 text-2xl font-bold tracking-[-0.04em] text-amber-600">{{ pendingCount }}</p>
        <p class="mt-1 text-[10px] text-slate-400">Hidden from the public site</p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-100 bg-white">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full sm:max-w-xs">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input v-model="search" type="search" placeholder="Search comments, people or posts" class="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#27628C]/40" />
        </div>
        <div class="flex gap-1 rounded-lg bg-slate-100 p-1">
          <button v-for="tab in [{ key: 'all', label: 'All' }, { key: 'approved', label: 'Approved' }, { key: 'pending', label: 'Pending' }]" :key="tab.key" type="button" class="rounded-md px-3 py-1.5 text-[10px] font-bold transition" :class="filter === tab.key ? 'bg-white text-[#27628C] shadow-sm' : 'text-slate-500'" @click="filter = tab.key as any">{{ tab.label }}</button>
        </div>
      </div>

      <AdminTableLoading v-if="loading" :columns="4" :rows="5" label="Loading comments" />

      <div v-else-if="filtered.length" class="overflow-x-auto">
        <table class="admin-table stack-table w-full">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50">
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Comment</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Post</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Reader</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Status</th>
              <th class="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="comment in filtered" :key="comment._id" class="hover:bg-slate-50/60">
              <td class="max-w-sm px-4 py-3">
                <p class="line-clamp-2 text-xs leading-5 text-slate-700">{{ comment.content }}</p>
                <p class="mt-1 text-[10px] text-slate-400">{{ formatDate(comment.createdAt) }}</p>
              </td>
              <td class="px-4 py-3">
                <a :href="postLink(comment)" target="_blank" rel="noopener noreferrer" class="line-clamp-2 max-w-[10rem] text-[10.5px] font-semibold text-[#27628C] hover:underline">
                  {{ publicationMap.get(String(comment.publicationId))?.title || 'Publication' }}
                </a>
              </td>
              <td class="px-4 py-3">
                <p class="text-[10.5px] font-semibold text-slate-800">{{ comment.userName || 'Reader' }}</p>
                <p class="text-[9.5px] text-slate-400">{{ comment.userEmail || '—' }}</p>
              </td>
              <td class="px-4 py-3">
                <button type="button" class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold" :class="comment.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'" @click="toggleApproval(comment)">
                  <span class="h-1.5 w-1.5 rounded-full" :class="comment.isApproved ? 'bg-emerald-500' : 'bg-amber-500'" />
                  {{ comment.isApproved ? 'Approved' : 'Pending' }}
                </button>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button type="button" class="p-2 text-slate-400 hover:text-[#27628C]" :title="comment.isApproved ? 'Hide comment' : 'Approve comment'" @click="toggleApproval(comment)"><Icon :name="comment.isApproved ? 'lucide:eye-off' : 'lucide:check'" class="h-4 w-4" /></button>
                  <button type="button" class="p-2 text-slate-400 hover:text-red-500" title="Delete comment" @click="confirmDelete(comment)"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminEmptyState v-else icon="lucide:message-circle" title="No comments found" description="Reader comments on your posts will appear here for moderation." />
    </div>

    <Modal v-model="showDelete" title="Delete comment" size="sm">
      <div class="space-y-4 p-5">
        <p class="text-xs leading-5 text-slate-600">Delete this comment and its replies? This cannot be undone.</p>
        <p class="rounded-lg bg-slate-50 p-3 text-[11px] leading-5 text-slate-600">{{ deleting?.content }}</p>
        <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button type="button" class="btn btn-secondary" @click="showDelete = false">Cancel</button>
          <button type="button" class="btn btn-danger" @click="handleDelete">Delete comment</button>
        </div>
      </div>
    </Modal>
  </div>
</template>
