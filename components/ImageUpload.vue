<template>
  <!-- Root fills whatever container the parent gives it -->
  <div class="relative w-full h-full">

    <!-- SINGLE MODE: image already set → fill container with preview -->
    <div v-if="!props.multiple && imageUrls.length" class="w-full h-full group relative">
      <img
        :src="imageUrls[0]"
        alt="Uploaded"
        class="w-full h-full object-cover"
      />
      <!-- action buttons -->
      <div class="absolute top-2 right-2 flex items-center gap-2">
        <button type="button" @click="triggerUpload"
          class="p-1.5 bg-white shadow-md rounded-full text-slate-700 hover:bg-slate-100 transition-colors">
          <ImageIcon class="w-4 h-4" />
        </button>
        <button type="button" @click="removeImage(0)"
          class="p-1.5 bg-red-600 shadow-md rounded-full text-white hover:bg-red-700 transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- UPLOAD AREA: no image yet (single), or always shown (multiple) -->
    <div
      v-else
      @click="triggerUpload"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      class="w-full h-full min-h-[8rem] border-2 border-dashed border-slate-300 rounded-[inherit]
             flex flex-col items-center justify-center gap-2 cursor-pointer
             hover:border-indigo-400 transition-all group"
      :class="{ 'border-indigo-500 bg-indigo-50': dragOver }"
    >
      <input ref="fileInput" type="file" accept="image/*" :multiple="multiple" class="hidden" @change="handleFileUpload" />

      <template v-if="!uploading">
        <ImageIcon class="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        <span class="text-xs text-slate-500 text-center px-2">Click to upload</span>
      </template>
      <Loader2 v-else class="w-7 h-7 text-indigo-600 animate-spin" />
    </div>

    <!-- MULTIPLE MODE grid (rendered below the dropzone) -->
    <div v-if="props.multiple && imageUrls.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
      <div v-for="(url, index) in imageUrls" :key="url" class="relative group/item">
        <div class="aspect-square rounded-lg overflow-hidden border-2 border-slate-200 group-hover/item:border-indigo-300 transition-colors">
          <img :src="url" :alt="`Image ${index + 1}`" class="w-full h-full object-cover" />
        </div>
        <button @click="removeImage(index)" type="button"
          class="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700
                 scale-100 transition-all shadow-md">
          <X class="w-3 h-3" />
        </button>
      </div>
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
  // const imageUrls = computed(() => {
  //   const rawValues = props.multiple 
  //     ? (Array.isArray(props.modelValue) ? props.modelValue : [])
  //     : (props.modelValue ? [props.modelValue] : [])

  //   return rawValues.map(val => {
  //     if (typeof val === 'string') return val
  //     if (val && typeof val === 'object' && 'url' in val) return (val as any).url
  //     return ''
  //   }).filter(url => !!url)
  // })

  const imageUrls = computed(() => {
  const extractUrl = (val: any): string => {
    if (!val) return ''
    if (typeof val === 'string') {
      if (val === '[object Object]') return ''
      return val
    }
    if (typeof val === 'object' && val !== null) {
      return val.url || val.secure_url || val.fileUrl || ''
    }
    return ''
  }

  const raw = props.multiple
    ? (Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue])
    : [props.modelValue]

  return raw.map(extractUrl).filter(Boolean)
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
  
  // const uploadFiles = async (files: File[]) => {
  //   try {
  //     uploading.value = true
      
  //     if (props.multiple) {
  //       const uploadPromises = files.map(file => singleUploadFile(file))
  //       const responses = await Promise.all(uploadPromises)
  //       const newUrls = responses.map(response => response.url)
  //       const currentUrls = Array.isArray(props.modelValue) ? props.modelValue : []
  //       emit('update:modelValue', [...currentUrls, ...newUrls])
  //     } else {
  //       const response = await singleUploadFile(files[0])
  //       emit('update:modelValue', response.url)
  //     }
  //   } catch (error) {
  //     console.error('Upload failed:', error)
  //   } finally {
  //     uploading.value = false
  //   }
  // }
  
  const uploadFiles = async (files: File[]) => {
  try {
    uploading.value = true

    if (props.multiple) {
      const responses = await Promise.all(files.map(file => singleUploadFile(file)))
      const newUrls = responses
        .map(r => r?.url || r?.secure_url || r?.fileUrl || '')
        .filter(Boolean)
      const currentUrls = Array.isArray(props.modelValue) ? props.modelValue : []
      emit('update:modelValue', [...currentUrls, ...newUrls])
    } else {
      const response = await singleUploadFile(files[0])
      const url = response?.url || response?.secure_url || response?.fileUrl || ''
      emit('update:modelValue', url)
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
  