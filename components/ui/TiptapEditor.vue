<template>
  <div class="border-[1.5rem] border-[#F8FAFC] rounded-[2.5rem] overflow-hidden bg-white shadow-sm ring-1 ring-slate-100">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap items-center gap-1.5 p-3 bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm sticky top-0 z-20">
      <!-- History -->
      <ToolbarButton @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" icon="lucide:undo" />
      <ToolbarButton @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" icon="lucide:redo" />
      
      <div class="w-px h-6 bg-slate-200 mx-2"></div>

      <!-- Formatting -->
      <ToolbarButton @click="editor.chain().focus().toggleBold().run()" :active="editor.isActive('bold')" icon="lucide:bold" />
      <ToolbarButton @click="editor.chain().focus().toggleItalic().run()" :active="editor.isActive('italic')" icon="lucide:italic" />
      <ToolbarButton @click="editor.chain().focus().toggleStrike().run()" :active="editor.isActive('strike')" icon="lucide:strikethrough" />
      <ToolbarButton @click="editor.chain().focus().toggleUnderline().run()" :active="editor.isActive('underline')" icon="lucide:underline" />

      <div class="w-px h-6 bg-slate-200 mx-2"></div>

      <!-- Headers -->
      <ToolbarButton @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :active="editor.isActive('heading', { level: 1 })" label="H1" />
      <ToolbarButton @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :active="editor.isActive('heading', { level: 2 })" label="H2" />
      <ToolbarButton @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :active="editor.isActive('heading', { level: 3 })" label="H3" />

      <div class="w-px h-6 bg-slate-200 mx-2"></div>

      <!-- Lists -->
      <ToolbarButton @click="editor.chain().focus().toggleBulletList().run()" :active="editor.isActive('bulletList')" icon="lucide:list" />
      <ToolbarButton @click="editor.chain().focus().toggleOrderedList().run()" :active="editor.isActive('orderedList')" icon="lucide:list-ordered" /> <!-- Use list icon but for ordered -->
      <ToolbarButton @click="editor.chain().focus().toggleBlockquote().run()" :active="editor.isActive('blockquote')" icon="lucide:quote" />

      <div class="w-px h-6 bg-slate-200 mx-2"></div>

      <!-- Links & Media -->
      <ToolbarButton @click="setLink" :active="editor.isActive('link')" icon="lucide:link" />
      <ToolbarButton @click="triggerImageUpload" icon="lucide:image" />

      <div class="flex-1"></div>

      <!-- Preview Toggle -->
      <button 
        type="button"
        @click="showPreview = !showPreview"
        class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#27628C] hover:bg-blue-50 transition-colors shadow-sm"
      >
        {{ showPreview ? 'Edit Content' : 'Live Preview' }}
      </button>
    </div>

    <!-- Editor / Preview Area -->
    <div class="relative min-h-[400px]">
      <div v-show="!showPreview" class="prose-container p-10">
        <editor-content :editor="editor" />
      </div>

      <!-- Live Email Preview Overlay -->
      <div v-if="showPreview" class="absolute inset-0 z-30 bg-white overflow-y-auto p-10">
        <div class="max-w-[600px] mx-auto border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden bg-white">
          <!-- Branded Wrapper Context -->
          <div class="bg-[#27628C] p-8 text-center">
            <h1 class="text-white text-xl font-black uppercase tracking-[0.2em]">MedLabConvo</h1>
          </div>
          <div class="p-12 prose max-w-none text-slate-700" v-html="modelValue"></div>
          <div class="bg-slate-50 p-8 text-center">
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sent from MedLabConvo Admin Panel</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden File Input for images -->
    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import ToolbarButton from './ToolbarButton.vue'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const showPreview = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const {监测UploadFile: uploadFile_custom, loading: uploading_legacy } = { 监测UploadFile: useSingleUploadFile().singleUploadFile, loading: useSingleUploadFile().loading } // Just locally rename for brevity or use directly
const { singleUploadFile, loading: uploading } = useSingleUploadFile()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline pointer-events-none' } }),
    Image.configure({ HTMLAttributes: { class: 'max-w-full rounded-2xl border border-slate-100 shadow-sm my-8' } }),
    Placeholder.configure({ placeholder: props.placeholder || 'Start writing your campaign content...' }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Sync external changes (like clearing)
watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val, { emitUpdate: false })
  }
})

const setLink = () => {
  const url = window.prompt('Enter URL')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  } else if (url === '') {
    editor.value?.chain().focus().unsetLink().run()
  }
}

const triggerImageUpload = () => fileInput.value?.click()

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const res = await singleUploadFile(file)
  if (res && res.url && editor.value) {
    editor.value.chain().focus().setImage({ src: res.url }).run()
  }
}
</script>

<style scoped>
:deep(.tiptap) {
  min-height: 350px;
  outline: none;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.8;
  color: #334155;
  white-space: pre-wrap;
}

:deep(.tiptap p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.prose h1) { font-size: 2rem; font-weight: 800; margin-bottom: 2rem; color: #1e293b; }
:deep(.prose h2) { font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; color: #1e293b; }
:deep(.prose h3) { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.25rem; color: #1e293b; }
:deep(.prose blockquote) { 
  border-left: 4px solid #CBD5E1; 
  padding-left: 1.5rem; 
  font-style: italic; 
  opacity: 0.8;
  margin: 2rem 0;
}
</style>
