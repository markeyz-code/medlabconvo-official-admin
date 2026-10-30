<template>
  <div class="min-h-screen bg-[#f5f7f8]">
    <!-- Writing toolbar -->
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-[1480px] flex-wrap items-center gap-2 px-4 py-2.5">
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          title="Back to Convo Stack"
          @click="$emit('cancel')"
        >
          <Icon name="lucide:arrow-left" class="h-4 w-4" />
        </button>

        <div class="min-w-0">
          <p class="text-[8px] font-bold uppercase tracking-[0.18em] text-[#27628C]">Convo Stack</p>
          <div class="flex items-center gap-2">
            <h1 class="truncate text-[13px] font-semibold text-slate-900">{{ publication ? 'Edit post' : 'New post' }}</h1>
            <span :class="['rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em]', displayStatus === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700']">
              {{ displayStatus }}
            </span>
          </div>
        </div>

        <div class="ml-auto flex flex-wrap items-center justify-end gap-1.5">
          <button
            type="button"
            class="btn btn-ghost"
            :class="showSettings ? 'bg-[#27628C]/5 text-[#27628C]' : ''"
            :aria-expanded="showSettings"
            @click="showSettings = !showSettings"
          >
            <Icon name="lucide:sliders-horizontal" class="h-3.5 w-3.5" />
            Settings
          </button>
          <a
            v-if="publication?.slug"
            :href="`https://www.medlabconvo.com/convostack/${publication.slug}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline hidden sm:inline-flex"
          >
            <Icon name="lucide:eye" class="h-3.5 w-3.5" />
            Preview
          </a>
          <button type="button" class="btn btn-outline" :disabled="!isValid || saving" @click="handleSave('draft')">
            Save draft
          </button>
          <button type="button" class="btn btn-primary" :disabled="!isValid || saving" @click="handleSave('published')">
            <Icon :name="saving ? 'lucide:loader-2' : 'lucide:send'" class="h-3.5 w-3.5" :class="{ 'animate-spin': saving }" />
            {{ saving ? 'Saving…' : publication?.status === 'published' ? 'Update' : 'Publish' }}
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto flex max-w-[1480px] flex-col gap-5 px-4 py-5 xl:flex-row">
      <!-- Writing surface -->
      <main class="min-w-0 flex-1">
        <div class="mx-auto max-w-[760px] space-y-3">
          <!-- Cover -->
          <div v-if="form.coverImage" class="group relative h-[210px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <img :src="form.coverImage" :alt="form.title || 'Cover'" class="h-full w-full object-cover" />
            <div class="absolute right-2 top-2 flex items-center gap-1.5">
              <button type="button" class="btn btn-outline !bg-white/95" @click="triggerCoverUpload">Change</button>
              <button type="button" class="btn btn-danger" @click="form.coverImage = ''">Remove</button>
            </div>
          </div>

          <div v-else-if="uploadingCover" class="flex h-16 items-center justify-center gap-2 rounded-xl border border-[#27628C]/20 bg-white">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-[#27628C]/20 border-t-[#27628C]" />
            <span class="text-[11px] font-semibold text-[#27628C]">Uploading cover…</span>
          </div>

          <button v-else type="button" class="group flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-left transition hover:border-[#27628C]/40 hover:bg-[#fbfdfe]" @click="triggerCoverUpload">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover:bg-[#27628C]/5 group-hover:text-[#27628C]">
              <Icon name="lucide:image-plus" class="h-4 w-4" />
            </span>
            <span class="min-w-0">
              <span class="block text-[11px] font-semibold text-slate-700">Add a cover image</span>
              <span class="block text-[9.5px] text-slate-400">Optional · landscape works best</span>
            </span>
            <span class="ml-auto text-[9px] font-medium text-slate-300">21:9</span>
          </button>
          <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />

          <!-- Document -->
          <article class="rounded-xl border border-slate-200 bg-white px-6 py-7 shadow-[0_1px_2px_rgba(16,42,58,0.03)] sm:px-12 sm:py-10">
            <textarea
              ref="titleRef"
              v-model="form.title"
              rows="1"
              placeholder="Title"
              class="editor-title"
              aria-label="Post title"
              @input="resizeTitle"
            />
            <input
              v-model="form.subtitle"
              type="text"
              placeholder="Add a subtitle…"
              class="editor-subtitle"
              aria-label="Post subtitle"
            />

            <div class="my-6 flex flex-wrap items-center gap-2 border-y border-slate-100 py-3 text-[10px] text-slate-400">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-[#27628C] text-[9px] font-bold text-white">
                {{ (form.authors?.[0] || 'M').charAt(0).toUpperCase() }}
              </span>
              <span class="font-semibold text-slate-600">{{ form.authors?.join(', ') || 'MedLabConvo Editorial' }}</span>
              <span>·</span>
              <span>{{ displayStatus }}</span>
              <span class="ml-auto inline-flex items-center gap-1"><Icon name="lucide:clock" class="h-3 w-3" />{{ computedReadTime }} min read</span>
            </div>

            <RichTextEditor v-model="form.bodyHtml" placeholder="Tell your story…" class="editor-body" />

            <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[9.5px] text-slate-400">
              <span>{{ wordCount }} words</span>
              <span>{{ computedReadTime }} min read</span>
            </div>
          </article>
        </div>
      </main>

      <!-- Settings rail -->
      <aside v-if="showSettings" class="w-full shrink-0 space-y-3 xl:w-[300px]">
        <div class="space-y-3 xl:sticky xl:top-[4.6rem] xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto xl:pr-1">
          <section class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex items-center justify-between">
              <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Publishing</p>
              <span :class="['rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase', displayStatus === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700']">{{ displayStatus }}</span>
            </div>
            <div class="mt-3 space-y-3">
              <div>
                <label class="field-label">Category</label>
                <input v-model="form.category" type="text" class="input" placeholder="e.g. Careers" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="field-label">Read time</label>
                  <div class="input flex items-center text-slate-500">{{ computedReadTime }} min</div>
                </div>
                <div>
                  <label class="field-label">Words</label>
                  <div class="input flex items-center text-slate-400">{{ wordCount }}</div>
                </div>
              </div>
              <div>
                <label class="field-label">Social preview excerpt</label>
                <textarea v-model="form.excerpt" rows="3" class="textarea" placeholder="Optional. Generated from the post if left empty." />
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-4">
            <button type="button" class="flex w-full items-start justify-between gap-3 text-left" @click="form.sendAsNewsletter = !form.sendAsNewsletter">
              <span>
                <span class="block text-[11px] font-semibold text-slate-800">Email subscribers</span>
                <span class="mt-0.5 block text-[9.5px] leading-4 text-slate-400">Send this post to active Convo Stack subscribers on publish.</span>
              </span>
              <span :class="['mt-0.5 flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition', form.sendAsNewsletter ? 'bg-[#27628C]' : 'bg-slate-200']">
                <span :class="['h-3 w-3 rounded-full bg-white shadow-sm transition-transform', form.sendAsNewsletter ? 'translate-x-3' : 'translate-x-0']" />
              </span>
            </button>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-4">
            <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">People &amp; topics</p>
            <div class="mt-3 space-y-3">
              <div>
                <label class="field-label">Authors</label>
                <input v-model="authorsInput" type="text" class="input" placeholder="Comma-separated names" />
                <div v-if="form.authors.length" class="mt-2 flex flex-wrap gap-1">
                  <span v-for="(author, i) in form.authors" :key="author" class="inline-flex items-center gap-1 rounded-md bg-[#27628C]/5 px-1.5 py-0.5 text-[9px] font-semibold text-[#27628C]">
                    {{ author }}
                    <button type="button" class="text-[#27628C]/50 hover:text-rose-500" @click="form.authors.splice(i, 1); authorsInput = form.authors.join(', ')"><Icon name="lucide:x" class="h-2.5 w-2.5" /></button>
                  </span>
                </div>
              </div>
              <div>
                <label class="field-label">Tags</label>
                <input v-model="tagsInput" type="text" class="input" placeholder="Comma-separated tags" />
                <div v-if="form.tags.length" class="mt-2 flex flex-wrap gap-1">
                  <span v-for="(tag, i) in form.tags" :key="tag" class="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                    {{ tag }}
                    <button type="button" class="text-slate-400 hover:text-rose-500" @click="form.tags.splice(i, 1); tagsInput = form.tags.join(', ')"><Icon name="lucide:x" class="h-2.5 w-2.5" /></button>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <details class="group rounded-xl border border-slate-200 bg-white">
            <summary class="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
              SEO &amp; metadata
              <Icon name="lucide:chevron-down" class="h-3 w-3 transition group-open:rotate-180" />
            </summary>
            <div class="space-y-3 border-t border-slate-100 px-4 py-3">
              <div>
                <label class="field-label">SEO title</label>
                <input v-model="form.metaTitle" type="text" class="input" placeholder="Optional override" />
              </div>
              <div>
                <label class="field-label">Meta description</label>
                <textarea v-model="form.metaDescription" rows="2" class="textarea" placeholder="Optional override" />
              </div>
              <div>
                <label class="field-label">Canonical URL</label>
                <input v-model="form.canonicalUrl" type="url" class="input" placeholder="Optional" />
              </div>
            </div>
          </details>

          <p class="px-1 text-[9px] leading-4 text-slate-400">Changes are saved when you choose Save draft or Publish.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, watchEffect, onMounted, nextTick } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import RichTextEditor from './RichTextEditor.vue'

interface Props {
  publication?: any
  saving?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])
const { showToast } = useCustomToast()
const { singleUploadFile } = useSingleUploadFile()

const showSettings = ref(true)
const titleRef = ref<HTMLTextAreaElement | null>(null)
const coverInputRef = ref<HTMLInputElement | null>(null)
const blockImageElements = ref<Record<number, HTMLInputElement | null>>({})
const uploadingCover = ref(false)
const blockUploading = reactive<Record<number, boolean>>({})

const form = reactive({
  title: '',
  subtitle: '',
  excerpt: '',
  coverImage: '',
  contentBlocks: [] as { type: string; content: string; caption: string }[],
  tags: [] as string[],
  category: '',
  status: 'draft',
  readTime: 5,
  metaTitle: '',
  metaDescription: '',
  authors: [] as string[],
  sendAsNewsletter: false,
  bodyHtml: '',
  substackId: null as number | null,
  canonicalUrl: ''
})

const resizeTitle = () => {
  const el = titleRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.innerWidth < 1280) showSettings.value = false
  nextTick(resizeTitle)
})

watch(() => form.title, () => nextTick(resizeTitle))

const tagsInput = ref('')
const authorsInput = ref('')

watch(tagsInput, (val) => {
  form.tags = val.split(',').map(t => t.trim()).filter(t => t.length > 0)
})

watch(authorsInput, (val) => {
  form.authors = val.split(',').map(a => a.trim()).filter(a => a.length > 0)
})


watchEffect(() => {
  if (props.publication) {
    Object.assign(form, {
      title: props.publication.title || '',
      subtitle: props.publication.subtitle || '',
      excerpt: props.publication.excerpt || '',
      coverImage: props.publication.coverImage || '',
      contentBlocks: (props.publication.contentBlocks || []).map((b: any) => ({ ...b })),
      tags: props.publication.tags || [],
      category: props.publication.category || '',
      status: props.publication.status || 'draft',
      readTime: props.publication.readTime || 5,
      metaTitle: props.publication.metaTitle || '',
      metaDescription: props.publication.metaDescription || '',
      authors: props.publication.authors || [],
      sendAsNewsletter: false, // Default to false even on edit
      bodyHtml: props.publication.bodyHtml || '',
      substackId: props.publication.substackId || null,
      canonicalUrl: props.publication.canonicalUrl || ''
    })
    tagsInput.value = (props.publication.tags || []).join(', ')
    authorsInput.value = (props.publication.authors || []).join(', ')
  } else {
    Object.assign(form, {
      title: '', subtitle: '', excerpt: '', coverImage: '', contentBlocks: [], tags: [], category: '',
      status: 'draft', readTime: 5, metaTitle: '', metaDescription: '', authors: [],
      sendAsNewsletter: false, bodyHtml: '', substackId: null, canonicalUrl: ''
    })
    tagsInput.value = ''
    authorsInput.value = ''
  }
})


const plainBody = computed(() => (form.bodyHtml || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim())
const wordCount = computed(() => plainBody.value ? plainBody.value.split(/\s+/).filter(Boolean).length : 0)
const computedReadTime = computed(() => Math.max(1, Math.round(wordCount.value / 220)))
const displayStatus = computed(() => form.status === 'published' ? 'Published' : form.status === 'in_review' ? 'In review' : form.status === 'archived' ? 'Archived' : 'Draft')
const isValid = computed(() => form.title.trim().length > 0)

// Block operations
const addBlock = (type: string) => {
  form.contentBlocks.push({ type, content: '', caption: '' })
}

const removeBlock = (index: number) => {
  form.contentBlocks.splice(index, 1)
}

const moveBlock = (index: number, direction: number) => {
  const target = index + direction
  if (target < 0 || target >= form.contentBlocks.length) return
  const temp = form.contentBlocks[index]
  form.contentBlocks[index] = form.contentBlocks[target]
  form.contentBlocks[target] = temp
}

// --- REAL IMAGE UPLOADS ---

const triggerCoverUpload = () => coverInputRef.value?.click()

const handleCoverUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingCover.value = true
  try {
    const res = await singleUploadFile(file)
    if (res?.url) {
      form.coverImage = res.url
      showToast({ title: 'Success', message: 'Cover image uploaded', toastType: 'success', duration: 2000 })
    }
  } catch (err) {
    showToast({ title: 'Error', message: 'Cover upload failed', toastType: 'error' })
  } finally {
    uploadingCover.value = false
    if (coverInputRef.value) coverInputRef.value.value = ''
  }
}

const setBlockImageRef = (index: number, el: any) => {
  if (el) blockImageElements.value[index] = el as HTMLInputElement
}

const triggerBlockImageUpload = (index: number) => {
  blockImageElements.value[index]?.click()
}

const handleBlockImageUpload = async (e: Event, index: number) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  blockUploading[index] = true
  try {
    const res = await singleUploadFile(file)
    if (res?.url) {
      form.contentBlocks[index].content = res.url
      showToast({ title: 'Success', message: 'Image uploaded', toastType: 'success', duration: 2000 })
    }
  } catch (err) {
    showToast({ title: 'Error', message: 'Image upload failed', toastType: 'error' })
  } finally {
    blockUploading[index] = false
  }
}

// Video helpers
const isEmbeddableVideo = (url: string) => {
  return url?.includes('youtube.com') || url?.includes('youtu.be') || url?.includes('vimeo.com')
}

const getEmbedUrl = (url: string) => {
  if (url.includes('youtube.com/watch?v=')) {
    const id = url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('vimeo.com/')) {
    const id = url.split('vimeo.com/')[1]?.split('?')[0]
    return `https://player.vimeo.com/video/${id}`
  }
  return url
}

const handleSave = (status: 'draft' | 'published') => {
  if (!isValid.value) return
  const excerpt = (form.excerpt || form.subtitle || plainBody.value || form.title).trim().slice(0, 240)
  emit('save', {
    ...form,
    excerpt,
    readTime: computedReadTime.value,
    status,
    sendAsNewsletter: status === 'published' && form.sendAsNewsletter,
  })
}
</script>

<style scoped>
.editor-title {
  display: block;
  width: 100%;
  min-height: 0 !important;
  height: auto;
  overflow: hidden;
  resize: none;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  font-family: var(--mc-font-heading, inherit);
  font-size: clamp(1.85rem, 3.4vw, 2.6rem) !important;
  font-weight: 700 !important;
  line-height: 1.14 !important;
  letter-spacing: -0.045em !important;
  color: #0a202b !important;
}
.editor-title::placeholder {
  color: #c3ced5 !important;
  font-weight: 700 !important;
}
.editor-subtitle {
  display: block;
  width: 100%;
  min-height: 0 !important;
  margin-top: 10px;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  font-size: 1.05rem !important;
  font-weight: 500 !important;
  line-height: 1.5 !important;
  color: #5f7482 !important;
}
.editor-subtitle::placeholder {
  color: #aab9c2 !important;
}
.editor-body :deep(.rich-text-editor) {
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}
.editor-body :deep(.rich-text-editor > div:first-child) {
  margin: 0 -30px 14px;
  border: 1px solid #eef2f5;
  border-radius: 8px;
  background: #fbfcfc !important;
}
.editor-body :deep(.prose) {
  min-height: 320px;
  padding: 4px 0 !important;
  font-size: 1rem;
  line-height: 1.8;
  color: #283f4d;
}
@media (max-width: 639px) {
  .editor-body :deep(.rich-text-editor > div:first-child) {
    margin: 0 0 14px;
  }
}
</style>
