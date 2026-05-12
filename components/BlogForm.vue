<template>
  <form @submit.prevent="handleSubmit" class="space-y-8 animate-in slide-in-from-right duration-500">
    <div class="space-y-6">
      <section>
        <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Core information</h4>
        <div class="space-y-4">
          <AnimatedInput
            v-model="form.title"
            id="blogTitle"
            label="Title"
            type="text"
            required
            position="top"
          />
          <AnimatedInput
            v-model="form.excerpt"
            id="blogExcerpt"
            label="Excerpt / Summary"
            type="textarea"
            :rows="3"
            position="bottom"
          />
        </div>
      </section>

      <section>
        <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Body content</h4>
        <AnimatedInput
          v-model="form.content"
          id="blogContent"
          label="Write your story..."
          type="textarea"
          :rows="15"
          required
        />
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Tags</h4>
          <AnimatedInput
            v-model="tagsInput"
            id="blogTags"
            label="Separated by commas"
            type="text"
          />
        </div>
        
        <div>
          <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Classification</h4>
          <SelectInput
            v-model="form.category"
            :options="categoryOptions"
          />
        </div>
      </section>

      <section class="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap items-center gap-8">
        <label class="flex items-center group cursor-pointer">
          <div class="relative flex items-center justify-center w-5 h-5 rounded border-2 border-slate-300 group-hover:border-[#033958] transition-colors">
            <input
              v-model="form.isPublished"
              type="checkbox"
              class="absolute opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div v-if="form.isPublished" class="w-2.5 h-2.5 bg-[#033958] rounded-sm"></div>
          </div>
          <span class="ml-3 text-sm font-bold text-slate-700 group-hover:text-[#033958] transition-colors">Publish immediately</span>
        </label>
        
        <label class="flex items-center group cursor-pointer">
          <div class="relative flex items-center justify-center w-5 h-5 rounded border-2 border-slate-300 group-hover:border-[#033958] transition-colors">
            <input
              v-model="form.isFeatured"
              type="checkbox"
              class="absolute opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div v-if="form.isFeatured" class="w-2.5 h-2.5 bg-[#033958] rounded-sm"></div>
          </div>
          <span class="ml-3 text-sm font-bold text-slate-700 group-hover:text-[#033958] transition-colors">Featured post</span>
        </label>
      </section>
    </div>

    <div class="flex items-center justify-end space-x-4 pt-8 border-t border-slate-100">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
      >
        Discard
      </button>
      <button
        type="submit"
        class="px-10 py-3 bg-[#033958] text-white text-sm font-bold rounded-xl hover:bg-[#022a41] transition-all active:scale-95"
      >
        {{ blog ? 'Save changes' : 'Publish blog' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'

const categoryOptions = [
  { label: 'Technology', value: 'technology' },
  { label: 'Education', value: 'education' },
  { label: 'Research', value: 'research' },
  { label: 'News', value: 'news' }
]

interface Props {
  blog?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])
const { showToast } = useCustomToast()

const form = reactive({
  title: '',
  excerpt: '',
  content: '',
  tags: [] as string[],
  category: '',
  isPublished: false,
  isFeatured: false
})

const tagsInput = ref('')

// Watch tags input and convert to array
watch(tagsInput, (newValue) => {
  form.tags = newValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
})

// Initialize form with blog data if editing
watchEffect(() => {
  if (props.blog) {
    Object.assign(form, {
      title: props.blog.title || '',
      excerpt: props.blog.excerpt || '',
      content: props.blog.content || '',
      tags: props.blog.tags || [],
      category: props.blog.category || '',
      isPublished: props.blog.status === 'published',
      isFeatured: props.blog.isFeatured || false
    })
    tagsInput.value = (props.blog.tags || []).join(', ')
  } else {
    // Reset form for new blog
    Object.assign(form, {
      title: '',
      excerpt: '',
      content: '',
      tags: [],
      category: '',
      isPublished: false,
      isFeatured: false
    })
    tagsInput.value = ''
  }
})

const handleSubmit = () => {
  if (!form.title.trim() || !form.content.trim()) {
    showToast({ title: "Validation Error", message: "Title and Content are required.", toastType: "error" });
    return;
  }
  emit('save', { ...form })
}
</script>