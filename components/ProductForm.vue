<template>
  <div class="animate-in slide-in-from-right duration-500">
    <!-- Premium Step Indicator -->
    <div class="mb-10">
      <div class="flex items-center justify-between px-2">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col items-center relative flex-1"
        >
          <!-- Progress Line -->
          <div 
            v-if="index < steps.length - 1"
            class="absolute top-4 left-1/2 w-full h-[1px] bg-slate-100 -z-10"
          >
            <div 
              class="h-full bg-[#033958] transition-all duration-500"
              :style="{ width: currentStep > index ? '100%' : '0%' }"
            ></div>
          </div>

          <div
            @click="currentStep = index"
            :class="[
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 cursor-pointer',
              currentStep === index 
                ? 'bg-[#033958] text-white ring-4 ring-[#033958]/10' 
                : currentStep > index 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
            ]"
          >
            <Icon v-if="currentStep > index" name="lucide:check" class="w-5 h-5" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span
            :class="[
              'mt-3 text-sm font-bold transition-colors duration-500 text-center px-1',
              currentStep >= index ? 'text-[#033958]' : 'text-slate-300'
            ]"
          >
            {{ step.title }}
          </span>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Step 1: Base Product Data -->
      <div v-if="currentStep === 0" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Product Fundamentals</h3>
          <p class="text-sm text-slate-500">Define the core attributes and pricing of your marketplace asset.</p>
        </header>

        <div class="space-y-4">
          <AnimatedInput
            v-model="form.name"
            id="productName"
            label="Product Title"
            type="text"
            required
            position="top"
          />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <SelectInput
              v-model="form.category"
              label="Product Category"
              :options="categoryOptions"
              position="middle"
            />
            <AnimatedInput
              v-model="form.author"
              id="productAuthor"
              label="Author / Contributor"
              type="text"
              required
              position="middle"
            />
          </div>
          <AnimatedInput
            v-model="form.description"
            id="productDesc"
            label="Product Narrative / Description"
            type="textarea"
            :rows="5"
            required
            position="bottom"
          />
        </div>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
          <AnimatedInput
            v-model="form.price"
            id="productPrice"
            label="Sales Price (₦)"
            type="number"
            required
          />
          <AnimatedInput
            v-model="form.originalPrice"
            id="productOrigPrice"
            label="Regular Price (₦)"
            type="number"
          />
          <AnimatedInput
            v-model="form.stock"
            id="productStock"
            label="Stock Level"
            type="number"
            required
          />
        </section>

        <section class="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-8">
          <label class="flex items-center group cursor-pointer">
            <div class="relative flex items-center justify-center w-5 h-5 rounded border-2 border-slate-300 group-hover:border-[#033958] transition-colors">
              <input
                v-model="form.isDigital"
                type="checkbox"
                class="absolute opacity-0 w-full h-full cursor-pointer z-10"
              />
              <div v-if="form.isDigital" class="w-2.5 h-2.5 bg-[#033958] rounded-sm"></div>
            </div>
            <span class="ml-3 text-sm font-bold text-slate-700">Digital asset</span>
          </label>

          <SelectInput
            v-model="form.status"
            label="Marketplace Status"
            :options="[
              {label:'Draft',value:'draft'},
              {label:'Active',value:'active'},
              {label:'Inactive',value:'inactive'}
            ]"
            class="flex-1"
          />
        </section>
      </div>

      <!-- Step 2: Technical Specifications -->
      <div v-if="currentStep === 1" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Technical Inventory</h3>
          <p class="text-sm text-slate-500">Detailed specifications tailored to the product category.</p>
        </header>

        <!-- Book-specific fields -->
        <div v-if="form.category === 'books' || form.category === 'ebooks'" class="space-y-4">
          <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Bibliographic details</h4>
          <div class="space-y-4">
            <AnimatedInput
              v-model="form.isbn"
              id="productIsbn"
              label="ISBN Identifier"
              type="text"
              position="top"
            />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
              <AnimatedInput
                v-model="form.publisher"
                id="productPublisher"
                label="Publisher Name"
                type="text"
                position="middle"
              />
              <AnimatedInput
                v-model="form.publicationDate"
                id="productPubDate"
                label="Release Date"
                type="date"
                position="middle"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
              <AnimatedInput
                v-model="form.pages"
                id="productPages"
                label="Page Count"
                type="number"
                position="bottom"
              />
              <AnimatedInput
                v-model="form.weight"
                id="productWeight"
                label="Shipping Weight (kg)"
                type="number"
                position="bottom"
              />
            </div>
          </div>
        </div>

        <!-- Course-specific fields -->
        <div v-if="form.category === 'courses'" class="space-y-4">
          <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Academy details</h4>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
              <AnimatedInput
                v-model="form.duration"
                id="productDuration"
                label="Total Course Hours"
                type="number"
                position="top"
              />
              <AnimatedInput
                v-model="form.instructor"
                id="productInstructor"
                label="Primary Instructor"
                type="text"
                position="top"
              />
            </div>
            <AnimatedInput
              v-model="form.videoUrl"
              id="productVideoUrl"
              label="Introductory Video URL"
              type="url"
              position="bottom"
            />
          </div>
        </div>

        <!-- Dimensions (for physical products) -->
        <div v-if="!form.isDigital" class="pt-6 border-t border-slate-50">
          <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Logistics / dimensions (cm)</h4>
          <div class="grid grid-cols-3 gap-0">
            <AnimatedInput v-model="form.dimensions.length" id="dimLength" label="Length" type="number" position="middle" />
            <AnimatedInput v-model="form.dimensions.width" id="dimWidth" label="Width" type="number" position="middle" />
            <AnimatedInput v-model="form.dimensions.height" id="dimHeight" label="Height" type="number" position="middle" />
          </div>
        </div>
      </div>

      <!-- Step 3: Brand Assets & Delivery -->
      <div v-if="currentStep === 2" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Showcase & Fulfillment</h3>
          <p class="text-sm text-slate-500">Upload high-fidelity product imagery and delivery endpoints.</p>
        </header>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Hero asset (cover)</h4>
            <ImageUpload
              v-model="form.imageUrl"
              :multiple="false"
              folder="products"
              class="rounded-3xl border border-slate-100"
            />
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Asset portfolio</h4>
            <ImageUpload
              v-model="form.imageGallery"
              :multiple="true"
              folder="products"
              class="rounded-3xl border border-slate-100"
            />
          </div>
        </section>

        <!-- Digital Delivery -->
        <section v-if="form.isDigital" class="pt-6 border-t border-slate-50">
          <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Fulfillment linkage</h4>
          <div class="space-y-4">
            <AnimatedInput v-model="form.downloadUrl" id="dlUrl" label="Secured Download Gateway (URL)" type="url" position="top" />
            <AnimatedInput v-model="form.previewUrl" id="prevUrl" label="Public Asset Preview (URL)" type="url" position="bottom" />
          </div>
        </section>

        <!-- Features & Tags -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-bold text-slate-400 px-1">Core features</h4>
              <button @click="addFeature" type="button" class="text-[#033958] text-sm font-bold hover:underline">Add</button>
            </div>
            <div class="space-y-3">
              <div v-for="(feature, index) in form.features" :key="index" class="flex items-center group">
                <div class="flex-1">
                  <AnimatedInput v-model="form.features[index]" :id="'feat-'+index" label="Feature Description" />
                </div>
                <button v-if="form.features.length > 1" @click="removeFeature(index)" class="ml-2 p-3 text-slate-300 hover:text-red-500 transition-colors">
                  <Icon name="lucide:trash-2" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Search keywords (tags)</h4>
            <AnimatedInput
              v-model="tagsInput"
              id="productTags"
              label="Comma separated keywords"
              type="text"
              @input="updateTags"
            />
            <div v-if="form.tags.length" class="flex flex-wrap gap-2 mt-4">
              <span v-for="tag in form.tags" :key="tag" class="px-3 py-1 bg-slate-50 text-slate-600 text-sm font-bold rounded-full border border-slate-100 flex items-center">
                {{ tag }}
                <button @click="removeTag(tag)" class="ml-2 hover:text-red-500 transition-colors">
                  <Icon name="lucide:x" class="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>
        </section>
      </div>

      <!-- Step 4: Final Review -->
      <div v-if="currentStep === 3" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8 text-center text-slate-900 font-bold tracking-tight">
          <h3 class="text-xl">Marketplace compliance</h3>
        </header>

        <div class="bg-[#1A1A1B09] rounded-3xl p-8 border border-slate-100 space-y-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="space-y-1">
              <span class="text-[9px] font-bold text-slate-400">Inventory status</span>
              <p class="text-sm font-bold text-slate-900">{{ form.stock }} Units Reserved</p>
            </div>
            <div class="space-y-1">
              <span class="text-[9px] font-bold text-slate-400">Public pricing</span>
              <p class="text-sm font-bold text-slate-900">₦{{ formatPrice(form.price) }}</p>
            </div>
            <div class="space-y-1">
              <span class="text-[9px] font-bold text-slate-400">Asset type</span>
              <p class="text-sm font-bold text-slate-900">{{ form.isDigital ? 'Digital' : 'Physical' }} Marketplace</p>
            </div>
            <div class="space-y-1">
              <span class="text-[9px] font-bold text-slate-400">Launch configuration</span>
              <p :class="['text-sm font-bold capitalize', form.status === 'active' ? 'text-emerald-600' : 'text-slate-400']">{{ form.status }}</p>
            </div>
          </div>

          <div class="p-6 bg-white rounded-2xl border border-slate-100 ">
            <h4 class="text-sm font-bold text-slate-900 mb-2">{{ form.name }}</h4>
            <p class="text-sm text-slate-500 ">{{ form.author }} · {{ form.category }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Footer -->
      <div class="flex items-center justify-between pt-8 border-t border-slate-100">
        <button
          v-if="currentStep > 0"
          @click="previousStep"
          type="button"
          class="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors inline-flex items-center space-x-2"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          <span>Previous</span>
        </button>
        <div v-else></div>

        <div class="flex items-center space-x-4">
          <button
            @click="$emit('cancel')"
            type="button"
            class="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            Discard
          </button>
          
          <button
            v-if="currentStep < steps.length - 1"
            @click="nextStep"
            type="button"
            class="px-10 py-3 bg-[#033958] text-white text-sm font-bold rounded-xl hover:bg-[#022a41] transition-all active:scale-95 inline-flex items-center space-x-2"
          >
            <span>Continue</span>
            <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </button>
          
          <button
            v-else
            type="submit"
            :disabled="isSubmitting"
            class="px-12 py-3 bg-[#033958] text-white text-sm font-bold rounded-xl hover:bg-[#022a41] transition-all active:scale-95 disabled:opacity-50 inline-flex items-center space-x-3"
          >
            <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>{{ product ? 'Update product' : 'Create product' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect, computed } from 'vue'
import { useCreateProduct } from "@/composables/modules/products/useCreateProduct"
import { useUpdateProduct } from "@/composables/modules/products/useUpdateProduct"
import { useCustomToast } from '@/composables/core/useCustomToast'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import Icon from '@/components/Icon.vue'
import { ProductCategory, ProductStatus, ProductAvailability } from '@/api_factory/modules/products'
  
interface Props {
  product?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['saved', 'cancel'])

const currentStep = ref(0)
const tagsInput = ref('')

const steps = [
  { title: 'Core', description: 'Base attributes' },
  { title: 'Technical', description: 'Specifications' },
  { title: 'Display', description: 'Assests & Fulfillment' },
  { title: 'Review', description: 'Marketplace Sync' }
]

const categoryOptions = [
  {label:'Books',value:'books'},
  {label:'Courses',value:'courses'},
  {label:'E-books',value:'ebooks'},
  {label:'Audiobooks',value:'audiobooks'},
  {label:'Software',value:'software'},
  {label:'Templates',value:'templates'}
]

// Composables
const {
  loading: createLoading,
  success: createSuccess,
  createProduct: performCreateProduct
} = useCreateProduct()

const {
  loading: updateLoading,
  success: updateSuccess,
  updateProduct: performUpdateProduct
} = useUpdateProduct()

const form = reactive({
  name: '',
  description: '',
  category: '',
  author: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  status: 'draft',
  availability: 'available',
  isDigital: false,
  imageUrl: '',
  imageGallery: [] as string[],
  features: [''],
  tags: [] as string[],
  isbn: '',
  publisher: '',
  publicationDate: '',
  pages: 0,
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0
  },
  duration: 0,
  instructor: '',
  videoUrl: '',
  downloadUrl: '',
  previewUrl: ''
})

watchEffect(() => {
  if (props.product) {
    Object.assign(form, {
      name: props.product.name || '',
      description: props.product.description || '',
      category: props.product.category || '',
      author: props.product.author || '',
      price: props.product.price || 0,
      originalPrice: props.product.originalPrice || 0,
      stock: props.product.stock || 0,
      status: props.product.status || 'draft',
      availability: props.product.availability || 'available',
      isDigital: props.product.isDigital || false,
      imageUrl: props.product.imageUrl || '',
      imageGallery: props.product.imageGallery || [],
      features: props.product.features?.length ? [...props.product.features] : [''],
      tags: props.product.tags || [],
      isbn: props.product.isbn || '',
      publisher: props.product.publisher || '',
      publicationDate: props.product.publicationDate ? new Date(props.product.publicationDate).toISOString().split('T')[0] : '',
      pages: props.product.pages || 0,
      weight: props.product.weight || 0,
      dimensions: props.product.dimensions ? { ...props.product.dimensions } : { length: 0, width: 0, height: 0 },
      duration: props.product.duration || 0,
      instructor: props.product.instructor || '',
      videoUrl: props.product.videoUrl || '',
      downloadUrl: props.product.downloadUrl || '',
      previewUrl: props.product.previewUrl || ''
    })
    tagsInput.value = props.product.tags?.join(', ') || ''
  }
})

const nextStep = () => {
  if (currentStep.value < steps.length - 1) currentStep.value++
}

const previousStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

const addFeature = () => form.features.push('')
const removeFeature = (index: number) => form.features.splice(index, 1)

const updateTags = () => {
  form.tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
}

const removeTag = (tagToRemove: string) => {
  form.tags = form.tags.filter(tag => tag !== tagToRemove)
  tagsInput.value = form.tags.join(', ')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG').format(price)
}

const { showToast } = useCustomToast()

const handleSubmit = async () => {
  if (!form.name.trim() || !form.category.trim() || !form.author.trim() || !form.description.trim()) {
    showToast({ title: "Validation Error", message: "Key details are required.", toastType: "error" });
    return;
  }
  try {
    const cleanedForm = {
      ...form,
      category: form.category as ProductCategory,
      status: form.status as ProductStatus,
      availability: form.availability as ProductAvailability,
      features: form.features.filter(feature => feature.trim()),
      publicationDate: form.publicationDate ? new Date(form.publicationDate) : undefined
    }
    
    if (props.product) {
      await performUpdateProduct(props.product.id || props.product._id, cleanedForm)
      if (updateSuccess.value) emit('saved')
    } else {
      await performCreateProduct(cleanedForm)
      if (createSuccess.value) emit('saved')
    }
  } catch (error) {
    console.error('Submit failed:', error)
  }
}

const isSubmitting = computed(() => createLoading.value || updateLoading.value)
</script>