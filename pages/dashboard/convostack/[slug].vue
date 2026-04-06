<template>
  <div class="-m-6 md:-m-8 lg:-m-10 bg-slate-100 min-h-screen relative">
    <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-50">
      <div class="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#033958] animate-spin"></div>
      <p class="mt-4 text-sm font-bold text-slate-500">Loading publication...</p>
    </div>
    
    <div v-else-if="!publication && !loading" class="flex flex-col items-center justify-center min-h-[60vh]">
      <Icon name="lucide:file-search" class="w-20 h-20 text-slate-300 mb-4" />
      <h3 class="text-xl font-bold text-slate-900">Publication not found</h3>
      <button @click="onCancel" class="mt-6 px-6 py-3 bg-slate-100 font-bold text-slate-600 rounded-xl hover:bg-slate-200 transition-all">Go back</button>
    </div>

    <ConvoStackEditor
      v-else
      :publication="publication"
      @save="onSave"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { definePageMeta, useRouter, useRoute } from '#imports'
import ConvoStackEditor from '@/components/convostack/ConvoStackEditor.vue'
import { convostack_api } from '@/api_factory/modules/convostack'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const router = useRouter()
const route = useRoute()
const slug = route.params.slug as string

const loading = ref(true)
const publication = ref<any>(null)

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

const onSave = () => {
  router.push('/dashboard/convostack')
}

const onCancel = () => {
  router.push('/dashboard/convostack')
}
</script>
