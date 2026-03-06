<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter blog title..."
        />
      </div>
  
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Excerpt</label>
        <textarea
          v-model="form.excerpt"
          rows="3"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Brief description of the blog post..."
        ></textarea>
      </div>
  
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Content</label>
        <textarea
          v-model="form.content"
          rows="12"
          required
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Write your blog content here..."
        ></textarea>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Tags</label>
          <input
            v-model="tagsInput"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter tags separated by commas..."
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <select
            v-model="form.category"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="education">Education</option>
            <option value="research">Research</option>
            <option value="news">News</option>
          </select>
        </div>
      </div>
  
      <div class="flex items-center space-x-6">
        <div class="flex items-center">
          <input
            v-model="form.isPublished"
            type="checkbox"
            class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
          />
          <label class="ml-2 block text-sm text-slate-700">Publish immediately</label>
        </div>
        
        <div class="flex items-center">
          <input
            v-model="form.isFeatured"
            type="checkbox"
            class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
          />
          <label class="ml-2 block text-sm text-slate-700">Featured post</label>
        </div>
      </div>
  
      <div class="flex justify-end space-x-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          {{ blog ? 'Update' : 'Create' }} Blog
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref, watch, watchEffect } from 'vue'
  import { useCustomToast } from '@/composables/core/useCustomToast'
  
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
        isPublished: props.blog.isPublished || false,
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
  