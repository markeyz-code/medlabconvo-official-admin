<template>
  <div class="rich-text-editor border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#033958]/20 focus-within:border-[#033958] transition-all">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
      <!-- Text Style -->
      <div class="flex items-center space-x-1 bg-white/50 p-1 rounded-lg border border-slate-200/50 mr-1">
        <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="btnClass(editor.isActive('bold'))" title="Bold">
          <Icon name="heroicons:bold" class="w-4 h-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggle().run()" :class="btnClass(editor.isActive(''))" title="">
          <Icon name="heroicons:" class="w-4 h-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="btnClass(editor.isActive('underline'))" title="Underline">
          <Icon name="heroicons:underline" class="w-4 h-4" />
        </button>
      </div>

      <div class="flex items-center space-x-1 bg-white/50 p-1 rounded-lg border border-slate-200/50 mr-1">
        <button type="button" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="btnClass(editor.isActive('heading', { level: 1 }))" title="H1">
          <span class="text-[10px] font-black">H1</span>
        </button>
        <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="btnClass(editor.isActive('heading', { level: 2 }))" title="H2">
          <span class="text-[10px] font-black">H2</span>
        </button>
      </div>

      <div class="flex items-center space-x-1 bg-white/50 p-1 rounded-lg border border-slate-200/50 mr-1">
        <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="btnClass(editor.isActive('bulletList'))" title="Bullets">
          <Icon name="heroicons:list-bullet" class="w-4 h-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="btnClass(editor.isActive('orderedList'))" title="Numbered List">
          <span class="text-[10px] font-black">1.</span>
        </button>
      </div>

      <div class="flex items-center space-x-1 bg-white/50 p-1 rounded-lg border border-slate-200/50 mr-1">
        <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="btnClass(editor.isActive('blockquote'))" title="Quote">
          <Icon name="heroicons:chat-bubble-bottom-center-text" class="w-4 h-4" />
        </button>
        <button type="button" @click="setLink" :class="btnClass(editor.isActive('link'))" title="Add Link">
          <Icon name="heroicons:link" class="w-4 h-4" />
        </button>
      </div>

      <div class="flex items-center space-x-1 ml-auto">
        <button type="button" @click="editor.chain().focus().undo().run()" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all" title="Undo">
          <Icon name="heroicons:arrow-uturn-left" class="w-4 h-4" />
        </button>
        <button type="button" @click="editor.chain().focus().redo().run()" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all" title="Redo">
          <Icon name="heroicons:arrow-uturn-right" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="prose prose-sm max-w-none px-6 py-6 min-h-[250px] focus:outline-none" />
  </div>
</template>


<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Start writing your content...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-indigo-600 underline' } }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  editorProps: {
    attributes: {
      class: 'outline-none min-h-[180px]',
    },
  },
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() || '')
  },
})

// Sync external changes
watch(() => props.modelValue, (val) => {
  const isSame = editor.value?.getHTML() === val
  if (!isSame && editor.value) {
    editor.value.commands.setContent(val || '', { emitUpdate: false })
  }
})


onBeforeUnmount(() => {
  editor.value?.destroy()
})

const btnClass = (active: boolean) => [
  'p-1.5 rounded transition-colors',
  active ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
]

const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)
  if (url === null) return
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>

<style>
.ProseMirror {
  min-height: 180px;
  outline: none;
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
.ProseMirror h1 { font-size: 1.75rem; font-weight: 700; margin: 0.5em 0; }
.ProseMirror h2 { font-size: 1.4rem; font-weight: 600; margin: 0.5em 0; }
.ProseMirror h3 { font-size: 1.15rem; font-weight: 600; margin: 0.5em 0; }
.ProseMirror p { margin: 0.5em 0; }
.ProseMirror ul { list-style: disc; padding-left: 1.5em; }
.ProseMirror ol { list-style: decimal; padding-left: 1.5em; }
.ProseMirror blockquote { border-left: 3px solid #6366f1; padding-left: 1em; margin: 1em 0; color: #64748b; font-style: ; }
.ProseMirror pre { background: #1e293b; color: #e2e8f0; border-radius: 0.5rem; padding: 1em; font-family: monospace; font-size: 0.875rem; overflow-x: auto; }
.ProseMirror code { background: #f1f5f9; padding: 0.15em 0.3em; border-radius: 0.25rem; font-size: 0.875rem; }
.ProseMirror hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.5em 0; }
.ProseMirror a { color: #6366f1; text-decoration: underline; }
</style>
