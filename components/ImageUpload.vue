<template>
    <div class="space-y-4">
      <!-- Upload Area -->
      <div
        @click="triggerUpload"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        class="relative border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-indigo-400 transition-all duration-200 cursor-pointer group"
        :class="{ 'border-indigo-500 bg-indigo-50': dragOver }"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          :multiple="multiple"
          class="hidden"
          @change="handleFileUpload"
        />
        
        <div v-if="!uploading" class="text-center">
          <ImageIcon class="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          <div class="mt-4">
            <p class="text-sm text-slate-600">
              <span class="font-medium text-indigo-600 hover:text-indigo-700">Click to upload</span>
              or drag and drop
            </p>
            <p class="text-sm text-slate-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
          </div>
        </div>
  
        <div v-else class="text-center">
          <Loader2 class="mx-auto h-8 w-8 text-indigo-600 animate-spin" />
          <p class="mt-2 text-sm text-slate-600">Uploading...</p>
        </div>
      </div>
  
      <!-- Image Previews -->
      <div v-if="imageUrls.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
            v-for="(url, index) in imageUrls"
            :key="url"
            class="relative group"
          >
            <div class="aspect-square rounded-lg overflow-hidden border-2 border-slate-200 group-hover:border-indigo-300 transition-colors">
              <img
                :src="url"
                :alt="`Image ${index + 1}`"
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
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { ImageIcon, Loader2, X } from 'lucide-vue-next'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
  
  interface Props {
    modelValue: string | string[]
    multiple?: boolean
    folder?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    multiple: false,
    folder: 'general'
  })
  
  const emit = defineEmits<{
    'update:modelValue': [value: string | string[]]
  }>()
  
  // Refs
  const fileInput = ref<HTMLInputElement>()
  const dragOver = ref(false)
  const uploading = ref(false)
  
  // Image upload composable
//   const { uploadImage } = useImageUpload()
const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse } = useSingleUploadFile()
  
  // Computed
  const imageUrls = computed(() => {
    const rawValues = props.multiple 
      ? (Array.isArray(props.modelValue) ? props.modelValue : [])
      : (props.modelValue ? [props.modelValue] : [])

    return rawValues.map(val => {
      if (typeof val === 'string') return val
      if (val && typeof val === 'object' && 'url' in val) return (val as any).url
      return ''
    }).filter(url => !!url)
  })
  
  // Methods
  const triggerUpload = () => {
    fileInput.value?.click()
  }
  
  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }
  
  const handleDrop = async (event: DragEvent) => {
    dragOver.value = false
    const files = Array.from(event.dataTransfer?.files || []).filter(file => 
      file.type.startsWith('image/')
    )
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }
  
  const uploadFiles = async (files: File[]) => {
    try {
      uploading.value = true
      
      if (props.multiple) {
        const uploadPromises = files.map(file => singleUploadFile(file))
        const responses = await Promise.all(uploadPromises)
        const newUrls = responses.map(response => response.url)
        const currentUrls = Array.isArray(props.modelValue) ? props.modelValue : []
        emit('update:modelValue', [...currentUrls, ...newUrls])
      } else {
        const response = await singleUploadFile(files[0])
        emit('update:modelValue', response.url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      uploading.value = false
    }
  }
  
  const removeImage = (index: number) => {
    if (props.multiple) {
      const currentUrls = Array.isArray(props.modelValue) ? props.modelValue : []
      const newUrls = currentUrls.filter((_, i) => i !== index)
      emit('update:modelValue', newUrls)
    } else {
      emit('update:modelValue', '')
    }
  }
  
  // Drag and drop handlers
  const handleDragOver = () => {
    dragOver.value = true
  }
  
  const handleDragLeave = () => {
    dragOver.value = false
  }
  </script>
  