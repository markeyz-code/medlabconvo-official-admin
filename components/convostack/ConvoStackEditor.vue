<template>
  <div class="flex flex-col h-full min-h-screen">
    <!-- Editor Header -->
    <div class="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button @click="$emit('cancel')" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
        <div>
          <h2 class="text-lg font-bold text-slate-900">{{ publication ? 'Edit Publication' : 'New Publication' }}</h2>
          <p class="text-sm text-slate-400 font-medium">Convo Stack Editor</p>
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
            'px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center space-x-2 active:scale-95',
            isValid
              ? 'bg-[#033958] text-white hover:bg-[#022f42]'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          ]"
        >
          <Icon name="lucide:check" class="w-4 h-4" />
          <span>{{ publication ? 'Save changes' : 'Publish' }}</span>
        </button>
      </div>
    </div>

    <!-- Editor Body -->
    <div class="flex-1 overflow-y-auto bg-slate-100">
      <div class="max-w-5xl mx-auto py-12 px-6 space-y-12">

        <!-- Cover Image Upload -->
        <div class="relative group">
          <div v-if="form.coverImage" class="relative rounded-3xl overflow-hidden aspect-[21/9] ring-1 ring-slate-200">
            <img :src="form.coverImage" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button @click="triggerCoverUpload" class="px-4 py-2 bg-white/90 backdrop-blur text-slate-900 rounded-xl font-bold text-sm hover:bg-white transition-all transform hover:scale-105 mr-2">Change cover</button>
              <button @click="form.coverImage = ''" class="px-4 py-2 bg-red-500/90 backdrop-blur text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all transform hover:scale-105">Remove</button>
            </div>
          </div>
          <div v-else-if="uploadingCover" class="relative rounded-3xl border-2 border-dashed border-[#033958] bg-slate-50 aspect-[21/9] flex flex-col items-center justify-center animate-pulse">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#033958] mb-3"></div>
            <p class="text-sm font-bold text-[#033958]">Uploading publication...</p>
          </div>
          <div v-else class="relative rounded-3xl border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-[#033958] transition-all aspect-[21/9] flex flex-col items-center justify-center cursor-pointer group/upload" @click="triggerCoverUpload">
            <div class="p-4 bg-slate-50 rounded-2xl group-hover/upload:bg-slate-100 transition-colors mb-4">
              <Icon name="lucide:image" class="w-12 h-12 text-slate-300 group-hover/upload:text-[#033958] transition-colors" />
            </div>
            <p class="text-sm font-bold text-slate-500">Upload cover image</p>
            <p class="text-sm text-slate-400 mt-2 font-medium">Recommended: landscape (21:9)</p>
          </div>
          <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />
        </div>

        <!-- Document Header (Substack Style) -->
        <div class="bg-white rounded-3xl p-10 md:p-14 border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 block ml-1">Main Title</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Enter your main title..."
              class="w-full text-4xl md:text-5xl font-black text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0 m-0 leading-tight tracking-tight block"
              style="all: unset; display: block; width: 100%; font-size: 2.5rem; font-weight: 900; line-height: 1.1; letter-spacing: -0.02em; color: #0f172a;"
            />
          </div>
          
          <div class="pt-4 border-t border-slate-50">
            <label class="text-[10px] font-bold text-[#27628C] uppercase tracking-[0.1em] mb-2 block ml-1">Substack Quality Subtitle</label>
            <input
              v-model="form.subtitle"
              type="text"
              placeholder="Add a compelling subtitle..."
              class="w-full text-xl md:text-2xl font-bold text-[#27628C] bg-transparent border-none outline-none focus:ring-0 p-0 m-0 leading-tight block italic"
              style="all: unset; display: block; width: 100%; font-size: 1.5rem; font-weight: 700; line-height: 1.2; color: #27628C; font-style: italic;"
            />
          </div>

          <div class="pt-4 border-t border-slate-50">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 block ml-1">Excerpt (SEO Summary)</label>
            <textarea
              v-model="form.excerpt"
              rows="2"
              placeholder="A brief summary for previews and search engines..."
              class="w-full text-lg md:text-xl font-medium text-slate-500 bg-transparent border-none outline-none resize-none focus:ring-0 p-0 m-0 block leading-relaxed"
              style="all: unset; display: block; width: 100%; font-size: 1.25rem; font-weight: 500; line-height: 1.6; color: #64748b; height: 3.2rem;"
            ></textarea>
          </div>
        </div>

        <!-- Substack Raw HTML Integration (High Fidelity) -->
        <div class="bg-[#033958]/5 rounded-3xl p-8 border border-[#033958]/10 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-[#033958] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Icon name="lucide:code-2" class="w-5 h-5" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900 leading-tight">Substack High-Fidelity Content</h4>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Input Raw HTML (Overwrites Block Engine)</p>
              </div>
            </div>
            <div v-if="form.bodyHtml" class="flex items-center bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-green-100">
              <Icon name="lucide:check-circle-2" class="w-3 h-3 mr-1.5" />
              ACTIVE
            </div>
          </div>
          <textarea
            v-model="form.bodyHtml"
            rows="6"
            placeholder="Paste your Substack body_html here to preserve exact formatting, image galleries, and buttons..."
            class="w-full p-6 bg-white border border-slate-200 rounded-2xl text-sm font-mono text-slate-600 focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-inner"
          ></textarea>
          <p class="text-[10px] text-slate-400 font-medium">Note: If this field contains data, the standard content block engine below will be ignored on the user-facing side.</p>
        </div>

        <!-- Content Blocks -->
        <div class="space-y-8 relative">
          <div v-if="form.contentBlocks.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <Icon name="lucide:file-plus" class="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-400">Start your publication</h3>
            <p class="text-sm text-slate-300 mt-2 font-medium">Add your first content block below to begin</p>
          </div>

          <div
            v-for="(block, index) in form.contentBlocks"
            :key="index"
            class="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-indigo-400 hover: hover:-500/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Block Controls (Sleeker) -->
            <div class="absolute -top-4 right-8 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center space-x-1 bg-white rounded-2xl  border border-slate-100 p-1.5 z-10">
              <button v-if="index > 0" @click="moveBlock(index, -1)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"><Icon name="lucide:chevron-up" class="w-4 h-4" /></button>
              <button v-if="index < form.contentBlocks.length - 1" @click="moveBlock(index, 1)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"><Icon name="lucide:chevron-down" class="w-4 h-4" /></button>
              <div class="w-px h-4 bg-slate-100 mx-1"></div>
              <button @click="removeBlock(index)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Icon name="lucide:trash-2" class="w-4 h-4" /></button>
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
                <Icon v-if="block.type === 'text'" name="lucide:file-text" class="w-4 h-4" />
                <Icon v-if="block.type === 'image'" name="lucide:image" class="w-4 h-4" />
                <Icon v-if="block.type === 'video'" name="lucide:video" class="w-4 h-4" />
                <Icon v-if="block.type === 'audio'" name="lucide:music" class="w-4 h-4" />
                <Icon v-if="block.type === 'quote'" name="lucide:quote" class="w-4 h-4" />
                <Icon v-if="block.type === 'divider'" name="lucide:minus" class="w-4 h-4" />
              </div>
              <span class="text-[10px] font-bold text-slate-400 capitalize">{{ block.type }} block</span>
            </div>

            <!-- Text Block -->
            <div v-if="block.type === 'text'">
              <RichTextEditor v-model="block.content" />
            </div>

            <!-- Image Block -->
            <div v-if="block.type === 'image'" class="space-y-6">
              <div v-if="block.content" class="rounded-2xl overflow-hidden border border-slate-200  group/img relative">
                <img :src="block.content" class="w-full max-h-[500px] object-contain bg-slate-50" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <button @click="triggerBlockImageUpload(index)" class="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm ">Replace Image</button>
                </div>
              </div>
              <div v-else-if="blockUploading[index]" class="border-2 border-dashed border-slate-100 rounded-2xl p-16 flex flex-col items-center justify-center bg-white animate-pulse">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#033958] mb-3"></div>
                <span class="text-sm text-[#033958] font-bold">Uploading...</span>
              </div>
              <div v-else class="border-2 border-dashed border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer hover:bg-white hover:border-[#033958] transition-all group/inner" @click="triggerBlockImageUpload(index)">
                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 group-hover/inner:scale-110 transition-transform">
                  <Icon name="lucide:image" class="w-8 h-8 text-slate-300" />
                </div>
                <span class="text-sm text-slate-400 font-bold">Add image</span>
              </div>
              <input :ref="el => setBlockImageRef(index, el)" type="file" accept="image/*" class="hidden" @change="e => handleBlockImageUpload(e, index)" />
              <input v-model="block.caption" type="text" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
            </div>

            <!-- Video Block -->
            <div v-if="block.type === 'video'" class="space-y-6">
              <div class="relative">
                <Icon name="lucide:link" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input v-model="block.content" type="text" class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
              </div>
              <div v-if="block.content && isEmbeddableVideo(block.content)" class="rounded-2xl overflow-hidden  aspect-video bg-black">
                <iframe :src="getEmbedUrl(block.content)" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
              </div>
              <input v-model="block.caption" type="text" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
            </div>

            <!-- Quote Block -->
            <div v-if="block.type === 'quote'" class="space-y-6">
              <div class="relative">
                <Icon name="lucide:message-square" class="absolute -left-2 -top-2 w-10 h-10 text-indigo-100 -z-0" />
                <textarea
                  v-model="block.content"
                  rows="3"
                 
                  class="relative z-10 w-full px-6 py-6 bg-indigo-50/50 border-l-4 border-indigo-500 rounded-r-3xl text-xl font-bold  text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <input v-model="block.caption" type="text" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
            </div>

            <!-- Divider -->
            <div v-if="block.type === 'divider'" class="py-10 flex items-center justify-center">
              <div class="w-24 h-1 bg-slate-100 rounded-full"></div>
            </div>
          </div>

          <!-- Add Block Toolbar (Floating or Bottom) -->
          <div class="sticky bottom-8 z-10 flex justify-center">
            <div class="flex items-center space-x-2 bg-white/80 backdrop-blur-xl p-2 rounded-3xl  border border-white/50 ring-1 ring-slate-200/50">
              <button @click="addBlock('text')" class="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all" title="Add Text"><Icon name="lucide:file-text" class="w-6 h-6" /></button>
              <button @click="addBlock('image')" class="p-3 text-green-600 hover:bg-green-50 rounded-2xl transition-all" title="Add Image"><Icon name="lucide:image" class="w-6 h-6" /></button>
              <button @click="addBlock('video')" class="p-3 text-purple-600 hover:bg-purple-50 rounded-2xl transition-all" title="Add Video"><Icon name="lucide:video" class="w-6 h-6" /></button>
              <button @click="addBlock('quote')" class="p-3 text-pink-600 hover:bg-pink-50 rounded-2xl transition-all" title="Add Quote"><Icon name="lucide:quote" class="w-6 h-6" /></button>
              <div class="w-px h-6 bg-slate-200 mx-1"></div>
              <button @click="addBlock('divider')" class="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all" title="Add Divider"><Icon name="lucide:minus" class="w-6 h-6" /></button>
            </div>
          </div>
        </div>

        <!-- Settings Section -->
        <div class="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
          <div class="flex items-center space-x-4 text-slate-900">
            <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
              <Icon name="lucide:settings" class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold tracking-tight">Publication settings</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 ml-1">Category</label>
              <input v-model="form.category" type="text" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-500 ml-1">Estimated read time (min)</label>
              <input v-model.number="form.readTime" type="number" min="1" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
            </div>
          </div>

          <!-- Newsletter Toggle -->
          <div class="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 flex items-center justify-between group/news">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover/news:scale-110 transition-transform">
                <Icon name="lucide:mail" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900">Push to Newsletter</h4>
                <p class="text-xs text-slate-500 font-medium">Send this publication to all active subscribers</p>
              </div>
            </div>
            <button 
              type="button"
              @click="form.sendAsNewsletter = !form.sendAsNewsletter"
              :class="[
                'w-14 h-8 rounded-full p-1 transition-all duration-300 ring-1 ring-inset',
                form.sendAsNewsletter ? 'bg-blue-600 ring-blue-700' : 'bg-slate-200 ring-slate-300'
              ]"
            >
              <div :class="['w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300', form.sendAsNewsletter ? 'translate-x-6' : 'translate-x-0']"></div>
            </button>
          </div>

          <!-- Authors Management -->
          <div class="space-y-2 border-t border-slate-50 pt-8">
            <label class="text-xs font-semibold text-slate-500 ml-1">Authors (separated by commas)</label>
            <input v-model="authorsInput" type="text" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
            <div v-if="form.authors.length" class="flex flex-wrap gap-2 mt-3">
              <span v-for="(author, i) in form.authors" :key="i" class="px-3 py-1.5 bg-blue-50 text-[#033958] text-[10px] font-bold rounded-full border border-blue-100 flex items-center space-x-2">
                <span>{{ author }}</span>
                <button @click="form.authors.splice(i, 1); authorsInput = form.authors.join(', ')" class="hover:text-rose-500 transition-colors"><Icon name="lucide:x" class="w-3 h-3" /></button>
              </span>
            </div>
          </div>


          <div class="space-y-2">
            <label class="text-xs font-semibold text-slate-500 ml-1">Tags (separated by commas)</label>
            <input v-model="tagsInput" type="text" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
            <div v-if="form.tags.length" class="flex flex-wrap gap-2 mt-3">
              <span v-for="(tag, i) in form.tags" :key="i" class="px-3 py-1.5 bg-slate-50 text-slate-700 text-[10px] font-bold rounded-full border border-slate-200 flex items-center space-x-2">
                <span>{{ tag }}</span>
                <button @click="form.tags.splice(i, 1); tagsInput = form.tags.join(', ')" class="hover:text-rose-500 transition-colors"><Icon name="lucide:x" class="w-3 h-3" /></button>
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-8 opacity-60 hover:opacity-100 transition-opacity">
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-500 ml-1">SEO title override</label>
              <input v-model="form.metaTitle" type="text" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-500 ml-1">Meta description</label>
              <textarea v-model="form.metaDescription" rows="3" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none resize-none transition-all shadow-sm"></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-500 ml-1">Canonical URL (for Substack migration)</label>
              <input v-model="form.canonicalUrl" type="url" placeholder="https://yourblog.substack.com/p/slug" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] outline-none transition-all shadow-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-500 ml-1">Substack External ID</label>
              <input v-model.number="form.substackId" type="number" readonly class="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-400 cursor-not-allowed outline-none transition-all shadow-sm" />
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
