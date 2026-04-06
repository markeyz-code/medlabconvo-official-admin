<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div class="w-full sm:w-72">
          <AnimatedInput
            v-model="searchQuery"
            id="search-blogs"
            label="Search blog posts"
            type="text"
          />
        </div>
        <div class="w-full sm:w-48">
          <SelectInput
            v-model="statusFilter"
            label="Filter status"
            :options="[
              { label: 'All status', value: '' },
              { label: 'Draft', value: 'draft' },
              { label: 'Published', value: 'published' }
            ]"
          />
        </div>
      </div>
      <button
        @click="openCreateModal"
        class="w-full md:w-auto px-6 py-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all duration-300 flex items-center justify-center space-x-3 group"
      >
        <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span class="font-bold text-sm">Create post</span>
      </button>
    </div>

    <!-- Blogs Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 text-sm">
      <div
        v-for="blog in filteredBlogs"
        :key="blog._id"
        class="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-[#033958]/20 transition-all duration-500"
      >
        <!-- Blog Image -->
        <div class="relative h-56 bg-slate-50 overflow-hidden">
          <div 
            class="absolute inset-0 bg-gradient-to-br from-[#033958]/5 to-transparent group-hover:scale-110 transition-transform duration-700"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <Icon name="lucide:image" class="w-16 h-16 text-slate-100 group-hover:text-slate-200 transition-colors duration-500" />
          </div>
          
          <!-- Status Badge Overlay -->
          <div class="absolute top-4 left-4">
            <span :class="[
              'px-3 py-1.5 text-[10px] font-bold rounded-full backdrop-blur-md',
              blog.status === 'published' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-200' : 'bg-amber-500/10 text-amber-700 border border-amber-200'
            ]">
              {{ blog.status }}
            </span>
          </div>
        </div>
        
        <!-- Blog Content -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-bold text-slate-400">{{ formatDate(blog.createdAt) }}</span>
            <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                @click="editBlog(blog)"
                class="p-2 text-slate-400 hover:text-[#033958] hover:bg-slate-50 rounded-lg transition-all"
              >
                <Icon name="lucide:pencil" class="w-4 h-4" />
              </button>
              <button
                @click="deleteBlog(blog.id)"
                class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              >
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <h3 class="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#033958] transition-colors duration-300 line-clamp-2 leading-tight tracking-tight">
            {{ blog.title }}
          </h3>
          <p class="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed font-medium">
            {{ blog.excerpt || blog.content }}
          </p>
          
          <div class="flex items-center justify-between pt-5 border-t border-slate-50">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-1.5 text-slate-400">
                <Icon name="lucide:eye" class="w-4 h-4" />
                <span class="text-sm font-bold">{{ blog.viewCount || 0 }}</span>
              </div>
              <div v-if="blog.category" class="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-bold rounded border border-slate-100">
                {{ blog.category }}
              </div>
            </div>
            <button 
              @click="editBlog(blog)"
              class="text-[#033958] text-[10px] font-bold hover:underline decoration-2 underline-offset-4"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="w-12 h-12 rounded-full border-4 border-slate-50 border-t-[#033958] animate-spin"></div>
      <span class="text-sm font-bold text-slate-400 animate-pulse">Loading blog posts...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredBlogs.length === 0" class="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
      <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
        <Icon name="lucide:file-text" class="w-10 h-10 text-slate-100" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2">No blog posts found</h3>
      <p class="text-slate-500 mb-8 max-w-xs text-center leading-relaxed font-medium">Create a new blog post to display content on the website.</p>
      <button
        @click="openCreateModal"
        class="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm"
      >
        Create first post
      </button>
    </div>

    <!-- Create/Edit Blog SlideOver -->
    <SlideOver v-model="showModal" :title="selectedBlog ? 'Edit post' : 'Create post'">
      <div class="p-8">
        <BlogForm
          :blog="selectedBlog"
          @save="handleSaveBlog"
          @cancel="closeModal"
        />
      </div>
    </SlideOver>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetBlogs } from '@/composables/modules/blogs/useGetBlogs'
import { useCreateBlog } from '@/composables/modules/blogs/useCreateBlog'
import { useUpdateBlog } from '@/composables/modules/blogs/useUpdateBlog'
import { usePublishBlog } from '@/composables/modules/blogs/usePublishBlog'
import { useSoftDeleteBlog } from '@/composables/modules/blogs/useSoftDeleteBlog'
import SlideOver from '@/components/SlideOver.vue'
import BlogForm from '@/components/BlogForm.vue'
import Icon from '@/components/Icon.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'

// Composables
const { blogs, loading, getBlogs } = useGetBlogs()
const { createBlog } = useCreateBlog()
const { updateBlog } = useUpdateBlog()
const { publishBlog: publishBlogAction } = usePublishBlog()
const { softDeleteBlog } = useSoftDeleteBlog()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const selectedBlog = ref<any>(null)

// Load blogs on mount
onMounted(() => {
  getBlogs()
})

// Computed
const filteredBlogs = computed(() => {
  let filtered = (blogs.value || []) as any[]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(blog => 
      blog.title?.toLowerCase().includes(query) ||
      blog.content?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(blog => blog.status === statusFilter.value)
  }

  return filtered
})

// Methods
const openCreateModal = () => {
  selectedBlog.value = null
  showModal.value = true
}

const editBlog = (blog: any) => {
  selectedBlog.value = blog
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedBlog.value = null
}

const handleSaveBlog = async (blogData: any) => {
  try {
    if (selectedBlog.value) {
      await updateBlog(selectedBlog.value.id, blogData)
    } else {
      await createBlog(blogData)
    }
    await getBlogs()
    closeModal()
  } catch (error) {
    console.error('Error saving blog:', error)
  }
}

const publishBlog = async (blogId: string) => {
  try {
    await publishBlogAction(blogId)
    await getBlogs()
  } catch (error) {
    console.error('Error publishing blog:', error)
  }
}

const deleteBlog = async (blogId: string) => {
  if (confirm('Are you sure you want to delete this blog?')) {
    try {
      await softDeleteBlog(blogId)
      await getBlogs()
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>