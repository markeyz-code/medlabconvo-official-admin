<template>
  <form @submit.prevent="handleSubmit" class="space-y-8 animate-in slide-in-from-right duration-500">
    <div class="space-y-6">
      <section>
        <h4 class="text-[10px] font-bold text-slate-400 mb-4 px-1">Meta information</h4>
        <div class="space-y-4">
          <AnimatedInput
            v-model="form.title"
            id="pubTitle"
            label="Research Paper Title"
            type="text"
            required
            position="top"
          />
          <AnimatedInput
            v-model="form.abstract"
            id="pubAbstract"
            label="Comprehensive Abstract / Summary"
            type="textarea"
            :rows="6"
            required
            position="bottom"
          />
        </div>
      </section>

      <section>
        <h4 class="text-[10px] font-bold text-slate-400 mb-4 px-1">Authorship & venue</h4>
        <div class="space-y-4">
          <AnimatedInput
            v-model="form.authors"
            id="pubAuthors"
            label="Principal Authors (Comma separated)"
            type="text"
            required
            position="top"
          />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <AnimatedInput
              v-model="form.journal"
              id="pubJournal"
              label="Journal / Venue Name"
              type="text"
              required
              position="middle"
            />
            <AnimatedInput
              v-model="form.year"
              id="pubYear"
              label="Publication Year"
              type="number"
              required
              position="middle"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <SelectInput
              v-model="form.category"
              label="Select Category"
              :options="categoryOptions"
              position="middle"
            />
            <SelectInput
              v-model="form.status"
              label="Publication Status"
              :options="statusOptions"
              position="bottom"
            />
          </div>
        </div>
      </section>

      <section>
        <h4 class="text-[10px] font-bold text-slate-400 mb-4 px-1">Access & identifiers</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatedInput
            v-model="form.pubLink"
            id="pubLink"
            label="Public Resource Link (URL)"
            type="url"
          />
          <AnimatedInput
            v-model="form.doi"
            id="pubDoi"
            label="DOI Identifier"
            type="text"
          />
        </div>
      </section>

      <section>
        <h4 class="text-[10px] font-bold text-slate-400 mb-4 px-1">Visual documentation</h4>
        <div class="space-y-4">
          <div
            @click="triggerImageUpload"
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false"
            @drop.prevent="handleImageDrop"
            :class="[
              'relative border-2 border-dashed rounded-3xl p-10 transition-all duration-500 group cursor-pointer flex flex-col items-center justify-center space-y-4',
              dragOver ? 'border-[#033958] bg-[#033958]/5' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
            ]"
          >
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleImageUpload"
            />
            
            <div v-if="!imageUploading" class="contents text-center">
              <div class="w-16 h-16 bg-white rounded-2xl  flex items-center justify-center text-slate-300 group-hover:text-[#033958] transition-colors">
                <Icon name="lucide:image" class="w-8 h-8" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-700">Drop supporting imagery here</p>
                <p class="text-[10px] font-bold text-slate-400 mt-1">PNG, JPEG, WEBP UP TO 10MB</p>
              </div>
            </div>

            <div v-else class="flex flex-col items-center space-y-4">
              <div class="w-12 h-12 rounded-full border-2 border-slate-100 border-t-[#033958] animate-spin"></div>
              <p class="text-[10px] font-bold text-[#033958]">Loading assets...</p>
            </div>
          </div>

          <!-- Image Previews -->
          <div v-if="form.images?.length" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 animate-in fade-in zoom-in-95 duration-500">
            <div
              v-for="(image, index) in form.images"
              :key="image"
              class="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 "
            >
              <img
                :src="getImageUrl(image)"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <button
                @click="removeImage(index)"
                type="button"
                class="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
              >
                <Icon name="lucide:trash-2" class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
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
        :disabled="isSubmitting"
        class="px-10 py-3 bg-[#033958] text-white text-sm font-bold rounded-xl hover:bg-[#022a41] transition-all active:scale-95 disabled:opacity-50 inline-flex items-center space-x-3"
      >
        <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <span>{{ publication ? 'Update publication' : 'Save publication' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect, onMounted, computed } from 'vue'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useCategories } from '@/composables/modules/publications/useCategories'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Icon from '@/components/Icon.vue'

interface Props {
  publication?: any,
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])

const { categories, getCategories } = useCategories()

onMounted(() => {
  getCategories()
})

const categoryOptions = computed(() => {
  return categories.value.map(c => ({ label: c.name, value: c.name }))
})

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Published', value: 'published' },
  { label: 'Rejected', value: 'rejected' }
]

// Image upload composable
const { singleUploadFile } = useSingleUploadFile()

// Refs
const imageInput = ref<HTMLInputElement>()
const dragOver = ref(false)
const imageUploading = ref(false)
const isSubmitting = ref(false)

const form = reactive({
  title: '',
  abstract: '',
  authors: '',
  journal: '',
  year: new Date().getFullYear(),
  doi: '',
  pubLink: '',
  category: '',
  status: 'draft',
  images: [] as string[]
})

watchEffect(() => {
  if (props.publication) {
    Object.assign(form, {
      title: props.publication.title || '',
      abstract: props.publication.abstract || '',
      authors: props.publication.authors || '',
      journal: props.publication.journal || '',
      year: props.publication.year || new Date().getFullYear(),
      doi: props.publication.doi || props.publication.pubLink || '',
      pubLink: props.publication.pubLink || '',
      category: props.publication.category || '',
      status: props.publication.status || 'draft',
      images: props.publication.images || []
    })
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
  if (image.startsWith('http')) return image
  return `/api/images/${image}`
}

const { showToast } = useCustomToast()

const handleSubmit = async () => {
  if (!form.title.trim() || !form.abstract.trim() || !form.authors.trim() || !form.journal.trim() || !form.year || !form.category.trim()) {
    showToast({ title: "Validation Error", message: "Key field are required.", toastType: "error" });
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
