<template>
    <div class="max-w-4xl mx-auto">
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex items-center"
            :class="{ 'flex-1': index < steps.length - 1 }"
          >
            <div class="flex items-center">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                  currentStep > index ? 'bg-indigo-600 text-white' : currentStep === index ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600' : 'bg-gray-100 text-gray-400'
                ]"
              >
                <Check v-if="currentStep > index" class="w-4 h-4" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span
                :class="[
                  'ml-2 text-sm font-medium',
                  currentStep >= index ? 'text-indigo-600' : 'text-gray-400'
                ]"
              >
                {{ step.title }}
              </span>
            </div>
            <div
              v-if="index < steps.length - 1"
              :class="[
                'flex-1 h-0.5 mx-4 transition-all duration-200',
                currentStep > index ? 'bg-indigo-600' : 'bg-gray-200'
              ]"
            ></div>
          </div>
        </div>
      </div>
  
      <!-- Step Content -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 0" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Basic Product Information</h3>
            <p class="text-sm text-gray-600">Enter the essential details of your product</p>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Product Name *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter product name..."
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                v-model="form.category"
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select category</option>
                <option value="books">Books</option>
                <option value="courses">Courses</option>
                <option value="ebooks">E-books</option>
                <option value="audiobooks">Audiobooks</option>
                <option value="software">Software</option>
                <option value="templates">Templates</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Author *
              </label>
              <input
                v-model="form.author"
                type="text"
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter author name..."
              />
            </div>
  
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Provide a detailed description of your product..."
              ></textarea>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Price *
              </label>
              <input
                v-model.number="form.price"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="0.00"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Original Price
              </label>
              <input
                v-model.number="form.originalPrice"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="0.00"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Stock Quantity *
              </label>
              <input
                v-model.number="form.stock"
                type="number"
                required
                min="0"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="0"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                v-model="form.status"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
  
          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input
                v-model="form.isDigital"
                type="checkbox"
                class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-slate-700">Digital Product</span>
            </label>
          </div>
        </div>
  
        <!-- Step 2: Category-Specific Details -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Product Details</h3>
            <p class="text-sm text-gray-600">Add category-specific information</p>
          </div>
  
          <!-- Book-specific fields -->
          <div v-if="form.category === 'books'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                ISBN
              </label>
              <input
                v-model="form.isbn"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="978-123-456-789-0"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Publisher
              </label>
              <input
                v-model="form.publisher"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Publisher name..."
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Publication Date
              </label>
              <input
                v-model="form.publicationDate"
                type="date"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Pages
              </label>
              <input
                v-model.number="form.pages"
                type="number"
                min="1"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Number of pages"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Weight (kg)
              </label>
              <input
                v-model.number="form.weight"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="0.00"
              />
            </div>
          </div>
  
          <!-- Course-specific fields -->
          <div v-if="form.category === 'courses'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Duration (hours)
              </label>
              <input
                v-model.number="form.duration"
                type="number"
                min="1"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Course duration in hours"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Instructor
              </label>
              <input
                v-model="form.instructor"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Instructor name..."
              />
            </div>
  
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Video URL
              </label>
              <input
                v-model="form.videoUrl"
                type="url"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>
  
          <!-- Dimensions (for physical products) -->
          <div v-if="!form.isDigital" class="space-y-4">
            <h4 class="font-medium text-slate-900">Dimensions (cm)</h4>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Length
                </label>
                <input
                  v-model.number="form.dimensions.length"
                  type="number"
                  min="0"
                  step="0.1"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Width
                </label>
                <input
                  v-model.number="form.dimensions.width"
                  type="number"
                  min="0"
                  step="0.1"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Height
                </label>
                <input
                  v-model.number="form.dimensions.height"
                  type="number"
                  min="0"
                  step="0.1"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>
        </div>
  
        <!-- Step 3: Media and Features -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Media & Features</h3>
            <p class="text-sm text-gray-600">Add images, features, and digital content</p>
          </div>
  
          <!-- Main Image -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Main Product Image *
            </label>
            <ImageUpload
              v-model="form.imageUrl"
              :multiple="false"
              folder="products"
            />
          </div>
  
          <!-- Image Gallery -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Image Gallery
            </label>
            <ImageUpload
              v-model="form.imageGallery"
              :multiple="true"
              folder="products"
            />
          </div>
  
          <!-- Features -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Product Features
            </label>
            <div class="space-y-2">
              <div
                v-for="(feature, index) in form.features"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="form.features[index]"
                  type="text"
                  class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter feature..."
                />
                <button
                  v-if="form.features.length > 1"
                  @click="removeFeature(index)"
                  type="button"
                  class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
              <button
                @click="addFeature"
                type="button"
                class="inline-flex items-center px-3 py-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Plus class="w-4 h-4 mr-1" />
                Add Feature
              </button>
            </div>
          </div>
  
          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Tags
            </label>
            <input
              v-model="tagsInput"
              type="text"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter tags separated by commas"
              @input="updateTags"
            />
            <div v-if="form.tags.length" class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="tag in form.tags"
                :key="tag"
                class="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
              >
                {{ tag }}
                <button
                  @click="removeTag(tag)"
                  type="button"
                  class="ml-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <X class="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>
  
          <!-- Digital Content URLs -->
          <div v-if="form.isDigital" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Download URL
              </label>
              <input
                v-model="form.downloadUrl"
                type="url"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/download/file.pdf"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Preview URL
              </label>
              <input
                v-model="form.previewUrl"
                type="url"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/preview/file.pdf"
              />
            </div>
          </div>
        </div>
  
        <!-- Step 4: Review -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Review & Submit</h3>
            <p class="text-sm text-gray-600">Review your product details before submitting</p>
          </div>
  
          <div class="bg-slate-50 rounded-xl p-6 space-y-4">
            <div>
              <h4 class="font-semibold text-slate-900 mb-2">Product Overview</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-slate-600">Name:</span>
                  <span class="ml-2 font-medium">{{ form.name }}</span>
                </div>
                <div>
                  <span class="text-slate-600">Category:</span>
                  <span class="ml-2 font-medium">{{ form.category }}</span>
                </div>
                <div>
                  <span class="text-slate-600">Author:</span>
                  <span class="ml-2 font-medium">{{ form.author }}</span>
                </div>
                <div>
                  <span class="text-slate-600">Price:</span>
                  <span class="ml-2 font-medium">₦{{ formatPrice(form.price) }}</span>
                </div>
                <div>
                  <span class="text-slate-600">Stock:</span>
                  <span class="ml-2 font-medium">{{ form.stock }}</span>
                </div>
                <div>
                  <span class="text-slate-600">Status:</span>
                  <span class="ml-2 font-medium">{{ form.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Navigation Buttons -->
        <div class="flex justify-between pt-6 border-t border-slate-200">
          <div>
            <button
              v-if="currentStep > 0"
              @click="previousStep"
              type="button"
              class="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <ChevronLeft class="w-4 h-4" />
              <span>Previous</span>
            </button>
          </div>
  
          <div class="flex space-x-3">
            <button
              @click="$emit('cancel')"
              type="button"
              class="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200"
            >
              Cancel
            </button>
            
            <button
              v-if="currentStep < steps.length - 1"
              @click="nextStep"
              type="button"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight class="w-4 h-4" />
            </button>
            
            <button
              v-else
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ product ? 'Update' : 'Create' }} Product</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref, watchEffect, computed } from 'vue'
  import {
    Check, Plus, Trash2, ChevronLeft, ChevronRight, Loader2, X
  } from 'lucide-vue-next'
  import { useCreateProduct } from "@/composables/modules/products/useCreateProduct"
  import { useUpdateProduct } from "@/composables/modules/products/useUpdateProduct"
  import { useCustomToast } from '@/composables/core/useCustomToast'
  
  interface Props {
    product?: any
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['saved', 'cancel'])
  
  const currentStep = ref(0)
  const tagsInput = ref('')
  
  const steps = [
    { title: 'Basic Info', description: 'Product details' },
    { title: 'Details', description: 'Category-specific' },
    { title: 'Media', description: 'Images & features' },
    { title: 'Review', description: 'Final review' }
  ]
  
  // Composables
  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
    product: createdProduct,
    createProduct: performCreateProduct,
    resetState: resetCreateState
  } = useCreateProduct()
  
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
    product: updatedProduct,
    updateProduct: performUpdateProduct,
    resetState: resetUpdateState
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
    // Book-specific
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
    // Course-specific
    duration: 0,
    instructor: '',
    videoUrl: '',
    // Digital content
    downloadUrl: '',
    previewUrl: ''
  })
  
  // Initialize form with product data if editing
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
        features: props.product.features?.length ? props.product.features : [''],
        tags: props.product.tags || [],
        isbn: props.product.isbn || '',
        publisher: props.product.publisher || '',
        publicationDate: props.product.publicationDate ? new Date(props.product.publicationDate).toISOString().split('T')[0] : '',
        pages: props.product.pages || 0,
        weight: props.product.weight || 0,
        dimensions: props.product.dimensions || { length: 0, width: 0, height: 0 },
        duration: props.product.duration || 0,
        instructor: props.product.instructor || '',
        videoUrl: props.product.videoUrl || '',
        downloadUrl: props.product.downloadUrl || '',
        previewUrl: props.product.previewUrl || ''
      })
      tagsInput.value = props.product.tags?.join(', ') || ''
    }
  })
  
  // Navigation methods
  const nextStep = () => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  }
  
  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }
  
  // Array management methods
  const addFeature = () => form.features.push('')
  const removeFeature = (index: number) => form.features.splice(index, 1)
  
  const updateTags = () => {
    form.tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
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
      showToast({ title: "Validation Error", message: "Name, Category, Author, and Description are required.", toastType: "error" });
      return;
    }
    if (form.price <= 0) {
      showToast({ title: "Validation Error", message: "Price must be greater than zero.", toastType: "error" });
      return;
    }
    isSubmitting.value = true
    try {
      // Clean up arrays and prepare data
      const cleanedForm = {
        ...form,
        features: form.features.filter(feature => feature.trim()),
        publicationDate: form.publicationDate ? new Date(form.publicationDate).toISOString() : undefined
      }
      
      if (props.product) {
        await performUpdateProduct(props.product._id, cleanedForm)
        if (updateSuccess.value) {
          emit('saved')
        }
      } else {
        await performCreateProduct(cleanedForm)
        if (createSuccess.value) {
          emit('saved')
        }
      }
    } finally {
      isSubmitting.value = false
    }
  }
  
  const isSubmitting = computed(() => createLoading.value || updateLoading.value)
  </script>
  