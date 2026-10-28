<template>
  <div class="-mx-2 -mt-2 sm:-m-6 md:-m-8 lg:-m-10 bg-slate-100 min-h-screen">
    <ConvoStackEditor
      :publication="null"
      @save="onSave"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '#imports'
import ConvoStackEditor from '@/components/convostack/ConvoStackEditor.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'convostack:create'
})

const router = useRouter()

const onSave = () => {
  router.push('/dashboard/convostack')
}

const onCancel = () => {
  router.push('/dashboard/convostack')
}
</script>
