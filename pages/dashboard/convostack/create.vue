<template>
  <div class="min-h-screen overflow-x-hidden bg-slate-100">
    <ConvoStackEditor :publication="null" :saving="saving" @save="onSave" @cancel="onCancel" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '#imports'
import ConvoStackEditor from '@/components/convostack/ConvoStackEditor.vue'
import { useCreateConvoStack } from '@/composables/modules/convostack/useCreateConvoStack'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'convostack:create'
})

const router = useRouter()
const saving = ref(false)
const { createPublication } = useCreateConvoStack()

const onSave = async (payload: any) => {
  saving.value = true
  try {
    const publication = await createPublication(payload)
    router.push(publication?.slug ? `/dashboard/convostack/${publication.slug}` : '/dashboard/convostack')
  } finally {
    saving.value = false
  }
}

const onCancel = () => {
  router.push('/dashboard/convostack')
}
</script>
