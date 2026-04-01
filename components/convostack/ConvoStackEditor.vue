<template>
  <div class="flex flex-col h-full min-h-screen">
    <!-- Editor Header -->
    <div class="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button @click="$emit('cancel')" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
        <div>
          <h2 class="text-lg font-bold text-slate-900">{{ publication ? 'Edit Publication' : 'New Publication' }}</h2>
          <p class="text-xs text-slate-400 font-medium">Convo Stack Editor</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <select v-model="form.status" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500">
          <option value="draft">Draft</option>
          <option value="in_review">In Review</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <button
          @click="handleSave"
          :disabled="!isValid"
          :class="[
            'px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center space-x-2',
            isValid
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          ]"
        >
          <Icon name="heroicons:check" class="w-4 h-4" />
          <span>{{ publication ? 'Update' : 'Publish' }}</span>
        </button>
      </div>
    </div>

    <!-- Editor Body -->
    <div class="flex-1 overflow-y-auto bg-slate-50/30">
      <div class="max-w-5xl mx-auto py-12 px-6 space-y-12">

        <!-- Cover Image Upload -->
        <div class="relative group">
          <div v-if="form.coverImage" class="relative rounded-3xl overflow-hidden aspect-[21/9] shadow-2xl ring-1 ring-slate-200">
            <img :src="form.coverImage" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button @click="triggerCoverUpload" class="px-4 py-2 bg-white/90 backdrop-blur text-slate-900 rounded-xl font-bold text-sm shadow-xl hover:bg-white transition-all transform hover:scale-105 mr-2">Change Cover</button>
              <button @click="form.coverImage = ''" class="px-4 py-2 bg-red-500/90 backdrop-blur text-white rounded-xl font-bold text-sm shadow-xl hover:bg-red-600 transition-all transform hover:scale-105">Remove</button>
            </div>
          </div>
          <div v-else-if="uploadingCover" class="relative rounded-3xl border-2 border-dashed border-indigo-400 bg-indigo-50/50 aspect-[21/9] flex flex-col items-center justify-center animate-pulse">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
            <p class="text-sm font-bold text-indigo-600 uppercase tracking-widest">Uploading Masterpiece...</p>
          </div>
          <div v-else class="relative rounded-3xl border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-indigo-400 transition-all aspect-[21/9] flex flex-col items-center justify-center cursor-pointer group/upload" @click="triggerCoverUpload">
            <div class="p-4 bg-slate-50 rounded-2xl group-hover/upload:bg-indigo-50 transition-colors mb-4">
              <Icon name="heroicons:photo" class="w-12 h-12 text-slate-300 group-hover/upload:text-indigo-400 transition-colors" />
            </div>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-widest">Upload Cover Image</p>
            <p class="text-xs text-slate-400 mt-2 font-medium">Recommended: High Resolution Landscape (21:9)</p>
          </div>
          <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />
        </div>

        <!-- Title & Excerpt -->
        <div class="space-y-6">
          <input
            v-model="form.title"
            type="text"
            placeholder="Enter an inspiring title..."
            class="w-full text-5xl font-black text-slate-900 placeholder-slate-200 border-none outline-none bg-transparent focus:ring-0 leading-tight tracking-tight"
          />
          <textarea
            v-model="form.excerpt"
            placeholder="Write a compelling summary that hooks your readers..."
            rows="2"
            class="w-full text-xl font-medium text-slate-500 placeholder-slate-200 border-none outline-none bg-transparent focus:ring-0 resize-none leading-relaxed italic"
          ></textarea>
        </div>

        <!-- Content Blocks -->
        <div class="space-y-8 relative">
          <div v-if="form.contentBlocks.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Icon name="heroicons:document-plus" class="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-400 uppercase tracking-widest">Your story starts here</h3>
            <p class="text-sm text-slate-300 mt-2">Add your first content block below to begin</p>
          </div>

          <div
            v-for="(block, index) in form.contentBlocks"
            :key="index"
            class="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Block Controls (Sleeker) -->
            <div class="absolute -top-4 right-8 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center space-x-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-10">
              <button v-if="index > 0" @click="moveBlock(index, -1)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"><Icon name="heroicons:chevron-up" class="w-4 h-4" /></button>
              <button v-if="index < form.contentBlocks.length - 1" @click="moveBlock(index, 1)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"><Icon name="heroicons:chevron-down" class="w-4 h-4" /></button>
              <div class="w-px h-4 bg-slate-100 mx-1"></div>
              <button @click="removeBlock(index)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Icon name="heroicons:trash" class="w-4 h-4" /></button>
            </div>

            <!-- Block Type Label -->
            <div class="flex items-center space-x-3 mb-6">
              <div :class="[
                'w-8 h-8 rounded-xl flex items-center justify-center',
                block.type === 'text' ? 'bg-blue-100 text-blue-600' :
                block.type === 'image' ? 'bg-green-100 text-green-600' :
                block.type === 'video' ? 'bg-purple-100 text-purple-600' :
                block.type === 'audio' ? 'bg-amber-100 text-amber-600' :
                block.type === 'quote' ? 'bg-pink-100 text-pink-600' :
                'bg-slate-100 text-slate-600'
              ]">
                <Icon v-if="block.type === 'text'" name="heroicons:document-text" class="w-4 h-4" />
                <Icon v-if="block.type === 'image'" name="heroicons:photo" class="w-4 h-4" />
                <Icon v-if="block.type === 'video'" name="heroicons:video-camera" class="w-4 h-4" />
                <Icon v-if="block.type === 'audio'" name="heroicons:musical-note" class="w-4 h-4" />
                <Icon v-if="block.type === 'quote'" name="heroicons:chat-bubble-bottom-center-text" class="w-4 h-4" />
                <Icon v-if="block.type === 'divider'" name="heroicons:minus" class="w-4 h-4" />
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ block.type }} block</span>
            </div>

            <!-- Text Block -->
            <div v-if="block.type === 'text'">
              <RichTextEditor v-model="block.content" placeholder="Type your story..." />
            </div>

            <!-- Image Block -->
            <div v-if="block.type === 'image'" class="space-y-6">
              <div v-if="block.content" class="rounded-2xl overflow-hidden border border-slate-200 shadow-lg group/img relative">
                <img :src="block.content" class="w-full max-h-[500px] object-contain bg-slate-50" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <button @click="triggerBlockImageUpload(index)" class="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-xl">Replace Image</button>
                </div>
              </div>
              <div v-else-if="blockUploading[index]" class="border-2 border-dashed border-indigo-400 rounded-2xl p-16 flex flex-col items-center justify-center bg-indigo-50/30 animate-pulse">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
                <span class="text-sm text-indigo-600 font-black uppercase tracking-widest">Uploading...</span>
              </div>
              <div v-else class="border-2 border-dashed border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer hover:bg-white hover:border-indigo-400 transition-all group/inner" @click="triggerBlockImageUpload(index)">
                <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover/inner:scale-110 transition-transform">
                  <Icon name="heroicons:photo" class="w-8 h-8 text-slate-300" />
                </div>
                <span class="text-sm text-slate-400 font-bold uppercase tracking-widest">Add an image</span>
              </div>
              <input :ref="el => setBlockImageRef(index, el)" type="file" accept="image/*" class="hidden" @change="e => handleBlockImageUpload(e, index)" />
              <input v-model="block.caption" type="text" placeholder="Add a descriptive caption..." class="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 placeholder-slate-300 font-medium italic" />
            </div>

            <!-- Video Block -->
            <div v-if="block.type === 'video'" class="space-y-6">
              <div class="relative">
                <Icon name="heroicons:link" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input v-model="block.content" type="text" placeholder="Paste YouTube or Vimeo URL here..." class="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 font-medium" />
              </div>
              <div v-if="block.content && isEmbeddableVideo(block.content)" class="rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black">
                <iframe :src="getEmbedUrl(block.content)" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
              </div>
              <input v-model="block.caption" type="text" placeholder="Video caption..." class="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 placeholder-slate-300 font-medium italic" />
            </div>

            <!-- Quote Block -->
            <div v-if="block.type === 'quote'" class="space-y-6">
              <div class="relative">
                <Icon name="heroicons:chat-bubble-left-right" class="absolute -left-2 -top-2 w-10 h-10 text-indigo-100 -z-0" />
                <textarea
                  v-model="block.content"
                  rows="3"
                  placeholder="The quote that matters..."
                  class="relative z-10 w-full px-6 py-6 bg-indigo-50/50 border-l-4 border-indigo-500 rounded-r-3xl text-xl font-bold italic text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <input v-model="block.caption" type="text" placeholder="— Author Name" class="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 font-black uppercase tracking-widest" />
            </div>

            <!-- Divider -->
            <div v-if="block.type === 'divider'" class="py-10 flex items-center justify-center">
              <div class="w-24 h-1 bg-slate-100 rounded-full"></div>
            </div>
          </div>

          <!-- Add Block Toolbar (Floating or Bottom) -->
          <div class="sticky bottom-8 z-10 flex justify-center">
            <div class="flex items-center space-x-2 bg-white/80 backdrop-blur-xl p-2 rounded-3xl shadow-2xl border border-white/50 ring-1 ring-slate-200/50">
              <button @click="addBlock('text')" class="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all" title="Add Text"><Icon name="heroicons:document-text" class="w-6 h-6" /></button>
              <button @click="addBlock('image')" class="p-3 text-green-600 hover:bg-green-50 rounded-2xl transition-all" title="Add Image"><Icon name="heroicons:photo" class="w-6 h-6" /></button>
              <button @click="addBlock('video')" class="p-3 text-purple-600 hover:bg-purple-50 rounded-2xl transition-all" title="Add Video"><Icon name="heroicons:video-camera" class="w-6 h-6" /></button>
              <button @click="addBlock('quote')" class="p-3 text-pink-600 hover:bg-pink-50 rounded-2xl transition-all" title="Add Quote"><Icon name="heroicons:chat-bubble-bottom-center-text" class="w-6 h-6" /></button>
              <div class="w-px h-6 bg-slate-200 mx-1"></div>
              <button @click="addBlock('divider')" class="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all" title="Add Divider"><Icon name="heroicons:minus" class="w-6 h-6" /></button>
            </div>
          </div>
        </div>

        <!-- Settings Section -->
        <div class="bg-white rounded-[40px] shadow-sm border border-slate-100 p-10 space-y-10">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <Icon name="heroicons:cog-8-tooth" class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-black text-slate-900 uppercase tracking-widest">Publication Settings</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <input v-model="form.category" type="text" placeholder="e.g. Science, Research" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimated Read Time (min)</label>
              <input v-model.number="form.readTime" type="number" min="1" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <!-- Authors Management -->
          <div class="space-y-2 border-t border-slate-50 pt-8">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Authors (separated by commas)</label>
            <input v-model="authorsInput" type="text" placeholder="Dr. Jane Doe, Prof. John Smith" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500" />
            <div v-if="form.authors.length" class="flex flex-wrap gap-2 mt-3">
              <span v-for="(author, i) in form.authors" :key="i" class="px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full border border-blue-100 flex items-center space-x-2">
                <span>{{ author }}</span>
                <button @click="form.authors.splice(i, 1); authorsInput = form.authors.join(', ')" class="hover:text-red-500 transition-colors"><Icon name="heroicons:x-mark" class="w-3 h-3" /></button>
              </span>
            </div>
          </div>


          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tags (separated by commas)</label>
            <input v-model="tagsInput" type="text" placeholder="tag1, tag2, tag3" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500" />
            <div v-if="form.tags.length" class="flex flex-wrap gap-2 mt-3">
              <span v-for="(tag, i) in form.tags" :key="i" class="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-full border border-indigo-100 flex items-center space-x-2">
                <span>{{ tag }}</span>
                <button @click="form.tags.splice(i, 1); tagsInput = form.tags.join(', ')" class="hover:text-red-500 transition-colors"><Icon name="heroicons:x-mark" class="w-3 h-3" /></button>
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-8 opacity-60 hover:opacity-100 transition-opacity">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SEO Title Override</label>
              <input v-model="form.metaTitle" type="text" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Description</label>
              <textarea v-model="form.metaDescription" rows="3" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, watchEffect } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import RichTextEditor from './RichTextEditor.vue'

interface Props {
  publication?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])
const { showToast } = useCustomToast()
const { singleUploadFile } = useSingleUploadFile()

const coverInputRef = ref<HTMLInputElement | null>(null)
const blockImageElements = ref<Record<number, HTMLInputElement | null>>({})
const uploadingCover = ref(false)
const blockUploading = reactive<Record<number, boolean>>({})

const form = reactive({
  title: '',
  excerpt: '',
  coverImage: '',
  contentBlocks: [] as { type: string; content: string; caption: string }[],
  tags: [] as string[],
  category: '',
  status: 'draft',
  readTime: 5,
  metaTitle: '',
  metaDescription: '',
  authors: [] as string[]
})

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
      excerpt: props.publication.excerpt || '',
      coverImage: props.publication.coverImage || '',
      contentBlocks: (props.publication.contentBlocks || []).map((b: any) => ({ ...b })),
      tags: props.publication.tags || [],
      category: props.publication.category || '',
      status: props.publication.status || 'draft',
      readTime: props.publication.readTime || 5,
      metaTitle: props.publication.metaTitle || '',
      metaDescription: props.publication.metaDescription || '',
      authors: props.publication.authors || []
    })
    tagsInput.value = (props.publication.tags || []).join(', ')
    authorsInput.value = (props.publication.authors || []).join(', ')
  } else {
    Object.assign(form, {
      title: '', excerpt: '', coverImage: '', contentBlocks: [], tags: [], category: '',
      status: 'draft', readTime: 5, metaTitle: '', metaDescription: '', authors: []
    })
    tagsInput.value = ''
    authorsInput.value = ''
  }
})


const isValid = computed(() => form.title.trim() !== '' && form.excerpt.trim() !== '')

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

const handleSave = () => {
  if (!isValid.value) return
  emit('save', { ...form })
}
</script>
