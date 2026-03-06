<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Title -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Title *
      </label>
      <input
        v-model="form.title"
        type="text"
        required
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
        placeholder="Publication title..."
      />
    </div>

    <!-- Abstract -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Abstract *
      </label>
      <textarea
        v-model="form.abstract"
        rows="4"
        required
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
        placeholder="Publication abstract..."
      ></textarea>
    </div>

    <!-- Images Upload -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Publication Images
      </label>
      <div class="space-y-4">
        <!-- Upload Area -->
        <div
          @click="triggerImageUpload"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleImageDrop"
          class="relative border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-amber-400 transition-all duration-200 cursor-pointer group"
          :class="{ 'border-amber-500 bg-amber-50': dragOver }"
        >
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleImageUpload"
          />
          
          <div v-if="!imageUploading" class="text-center">
            <ImagePlus class="mx-auto h-12 w-12 text-slate-400 group-hover:text-amber-500 transition-colors" />
            <div class="mt-4">
              <p class="text-sm text-slate-600">
                <span class="font-medium text-amber-600 hover:text-amber-700">Click to upload</span>
                or drag and drop
              </p>
              <p class="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </div>

          <div v-else class="text-center">
            <Loader2 class="mx-auto h-8 w-8 text-amber-600 animate-spin" />
            <p class="mt-2 text-sm text-slate-600">Uploading images...</p>
          </div>
        </div>

        <!-- Image Previews -->
        <div v-if="form.images?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <TransitionGroup
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
            tag="div"
            class="contents"
          >
            <div
              v-for="(image, index) in form.images"
              :key="image"
              class="relative group"
            >
              <div class="aspect-square rounded-lg overflow-hidden border-2 border-slate-200 group-hover:border-amber-300 transition-colors">
                <img
                  :src="getImageUrl(image)"
                  :alt="`Publication image ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
              <button
                @click="removeImage(index)"
                type="button"
                class="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- Authors -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Authors *
      </label>
      <input
        v-model="form.authors"
        type="text"
        required
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
        placeholder="Enter authors (comma-separated if multiple)..."
      />
    </div>

    <!-- Journal and Year -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Journal *
        </label>
        <input
          v-model="form.journal"
          type="text"
          required
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
          placeholder="Journal name..."
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Year *
        </label>
        <input
          v-model.number="form.year"
          type="number"
          required
          min="1900"
          :max="new Date().getFullYear() + 10"
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
          placeholder="Publication year..."
        />
      </div>
    </div>

    <!-- DOI and Links -->
    <div class="space-y-6">
      <!-- <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          DOI
        </label>
        <input
          v-model="form.doi"
          type="text"
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
          placeholder="Digital Object Identifier..."
        />
      </div> -->
      
      <!-- <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Publication Link
        </label>
        <input
          v-model="form.link"
          type="url"
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
          placeholder="Main publication URL..."
        />
      </div> -->
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Pub Link
          </label>
          <input
            v-model="form.pubLink"
            type="url"
            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
            placeholder="Publication URL..."
          />
        </div>
        <!-- <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            DOI Link
          </label>
          <input
            v-model="form.doiLink"
            type="url"
            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
            placeholder="DOI URL..."
          />
        </div> -->
      </div>
    </div>

    <!-- Category -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Category *
      </label>
      <select
        v-model="form.category"
        required
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
      >
        <option value="">Select category</option>
        <option value="Medical Laboratory Science">Medical Laboratory Science</option>
        <option value="Research Article">Research Article</option>
        <option value="Review Article">Review Article</option>
        <option value="Case Study">Case Study</option>
        <option value="Technical Report">Technical Report</option>
        <option value="Editorial">Editorial</option>
        <option value="Commentary">Commentary</option>
      </select>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 pt-6 border-t border-slate-200">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <span>{{ publication ? 'Update' : 'Create' }} Publication</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue'
import { ImagePlus, Loader2, X } from 'lucide-vue-next'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import { useCustomToast } from '@/composables/core/useCustomToast'

interface Props {
  publication?: any,
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])

// Image upload composable
const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse } = useSingleUploadFile()

// Refs
const imageInput = ref<HTMLInputElement>()
const dragOver = ref(false)
const imageUploading = ref(false)
const isSubmitting = ref(false)

// Update the form reactive object
const form = reactive({
  title: '',
  abstract: '',
  authors: '', // Changed from array to string
  journal: '',
  year: new Date().getFullYear(), // Changed from publicationDate to year
  doi: '',
  link: '', // Main publication link
  pubLink: '', // Publication link
  doiLink: '', // DOI link
  category: '',
  images: [] as string[]
})

// Remove keywordsInput ref
const authorsInput = ref('') // Keep this for display purposes

// Remove the keywords watch function

// Update the watchEffect to match new schema
watchEffect(() => {
  if (props.publication) {
    Object.assign(form, {
      title: props.publication.title || '',
      abstract: props.publication.abstract || '',
      authors: props.publication.authors || '',
      journal: props.publication.journal || '',
      year: props.publication.year || new Date().getFullYear(),
      doi: props.publication.pubLink || '',
      link: props.publication.pubLink || '',
      pubLink: props.publication.pubLink || '',
      doiLink: props.publication.doiLink || '',
      category: props.publication.category || '',
      images: props.publication.images || []
    })
    authorsInput.value = props.publication.authors || ''
  } else {
    // Reset form for new publication
    Object.assign(form, {
      title: '',
      abstract: '',
      authors: '',
      journal: '',
      year: new Date().getFullYear(),
      doi: '',
      link: '',
      pubLink: '',
      doiLink: '',
      category: '',
      images: []
    })
    authorsInput.value = ''
  }
})

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    await uploadImages(files)
  }
}

const handleImageDrop = async (event: DragEvent) => {
  dragOver.value = false
  const files = Array.from(event.dataTransfer?.files || []).filter(file => 
    file.type.startsWith('image/')
  )
  if (files.length > 0) {
    await uploadImages(files)
  }
}

const uploadImages = async (files: File[]) => {
  try {
    imageUploading.value = true
    const uploadPromises = files.map(file => singleUploadFile(file))
    const responses = await Promise.all(uploadPromises)
    
    const newImages = responses.map(response => response.url)
    form.images.push(...newImages)
  } catch (error) {
    console.error('Image upload failed:', error)
  } finally {
    imageUploading.value = false
  }
}

const removeImage = (index: number) => {
  form.images.splice(index, 1)
}

const getImageUrl = (image: string) => {
  if (image.startsWith('http')) {
    return image
  }
  return `/api/images/${image}`
}

// Drag and drop handlers
const handleDragOver = () => {
  dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}

const { showToast } = useCustomToast()

const handleSubmit = async () => {
  if (!form.title.trim() || !form.abstract.trim() || !form.authors.trim() || !form.journal.trim() || !form.year || !form.category.trim()) {
    showToast({ title: "Validation Error", message: "Title, Abstract, Authors, Journal, Year, and Category are required.", toastType: "error" });
    return;
  }
  isSubmitting.value = true
  try {
    await emit('save', { ...form })
  } finally {
    isSubmitting.value = false
  }
}
</script>
