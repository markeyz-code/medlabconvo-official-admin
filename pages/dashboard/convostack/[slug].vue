<template>
  <div class="min-h-screen overflow-x-hidden bg-slate-100 relative">
    <div v-if="loading" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#27628C]" />
      <p class="mt-4 text-sm font-bold text-slate-500">Loading publication…</p>
    </div>

    <div v-else-if="!publication" class="flex min-h-[60vh] flex-col items-center justify-center">
      <Icon name="lucide:file-search" class="mb-4 h-20 w-20 text-slate-300" />
      <h3 class="text-xl font-bold text-slate-900">Publication not found</h3>
      <button class="mt-6 rounded-xl bg-slate-100 px-6 py-3 font-bold text-slate-600 transition hover:bg-slate-200" @click="onCancel">Go back</button>
    </div>

    <ConvoStackEditor v-else :publication="publication" :saving="saving" @save="onSave" @cancel="onCancel" />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from '#imports'
import ConvoStackEditor from '@/components/convostack/ConvoStackEditor.vue'
import { convostack_api } from '@/api_factory/modules/convostack'
import { useUpdateConvoStack } from '@/composables/modules/convostack/useUpdateConvoStack'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'convostack:update'
})

const router = useRouter()
const route = useRoute()
const slug = route.params.slug as string
const loading = ref(true)
const saving = ref(false)
const publication = ref<any>(null)
const { updatePublication } = useUpdateConvoStack()

onMounted(async () => {
  loading.value = true
  try {
    const response = await convostack_api.$_get_publication_by_slug(slug)
    publication.value = response.data
  } catch (error) {
    console.error('Failed to load publication for editing', error)
  } finally {
    loading.value = false
  }
})

const onSave = async (payload: any) => {
  if (!publication.value?._id) return
  saving.value = true
  try {
    const updated = await updatePublication(publication.value._id, payload)
    publication.value = updated || publication.value
    if (updated?.slug && updated.slug !== slug) router.replace(`/dashboard/convostack/${updated.slug}`)
  } finally {
    saving.value = false
  }
}

const onCancel = () => router.push('/dashboard/convostack')
</script>
