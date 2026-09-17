<template>
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <span
              :class="[
                'px-3 py-1 text-sm font-semibold rounded-full',
                getStatusColor(product.status)
              ]"
            >
              {{ formatStatus(product.status) }}
            </span>
            <span
              :class="[
                'px-3 py-1 text-sm font-medium rounded-full',
                product.availability === 'available' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              ]"
            >
              {{ product.availability === 'available' ? 'Available' : 'Unavailable' }}
            </span>
            <span v-if="product.isDigital" class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
              Digital
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('edit', product)"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
            >
              <Edit class="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              @click="$emit('close')"
              class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <h1 class="text-lg font-bold text-slate-900 mb-2">
          {{ product.name }}
        </h1>
        <p class="text-lg text-indigo-600 font-medium mb-4">by {{ product.author }}</p>
        
        <div class="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
          <div class="flex items-center space-x-2">
            <Package class="w-4 h-4" />
            <span>{{ formatCategoryName(product.category) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <DollarSign class="w-4 h-4" />
            <span>₦{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice && product.originalPrice > product.price" class="line-through text-slate-400">
              ₦{{ formatPrice(product.originalPrice) }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <Package class="w-4 h-4" />
            <span>Stock: {{ product.stock }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <Calendar class="w-4 h-4" />
            <span>Created {{ formatDate(product.createdAt) }}</span>
          </div>
        </div>
      </div>
  
      <!-- Main Image -->
      <div v-if="product.imageUrl" class="mb-8">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-64 object-cover rounded-xl cursor-pointer"
          @click="openImageModal(product.imageUrl)"
        />
      </div>
  
      <!-- Description -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Description</h3>
        <div class="prose prose-slate max-w-none">
          <p class="text-slate-700 leading-relaxed">{{ product.description }}</p>
        </div>
      </div>
  
      <!-- Product Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-slate-50 rounded-lg p-4 text-center">
          <div class="flex items-center justify-center mb-2">
            <Eye class="w-5 h-5 text-slate-600" />
          </div>
          <div class="text-lg font-bold text-slate-900">{{ product.viewCount || 0 }}</div>
          <div class="text-sm text-slate-600">Views</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-4 text-center">
          <div class="flex items-center justify-center mb-2">
            <ShoppingCart class="w-5 h-5 text-slate-600" />
          </div>
          <div class="text-lg font-bold text-slate-900">{{ product.salesCount || 0 }}</div>
          <div class="text-sm text-slate-600">Sales</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-4 text-center">
          <div class="flex items-center justify-center mb-2">
            <Star class="w-5 h-5 text-slate-600" />
          </div>
          <div class="text-lg font-bold text-slate-900">{{ product.rating || 0 }}</div>
          <div class="text-sm text-slate-600">Rating</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-4 text-center">
          <div class="flex items-center justify-center mb-2">
            <MessageSquare class="w-5 h-5 text-slate-600" />
          </div>
          <div class="text-lg font-bold text-slate-900">{{ product.reviewCount || 0 }}</div>
          <div class="text-sm text-slate-600">Reviews</div>
        </div>
      </div>
  
      <!-- Product Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- Book-specific details -->
        <div v-if="product.category === 'books'" class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Book Details</h3>
          <div class="space-y-3">
            <div v-if="product.isbn" class="flex justify-between">
              <span class="text-slate-600">ISBN:</span>
              <span class="font-medium">{{ product.isbn }}</span>
            </div>
            <div v-if="product.publisher" class="flex justify-between">
              <span class="text-slate-600">Publisher:</span>
              <span class="font-medium">{{ product.publisher }}</span>
            </div>
            <div v-if="product.publicationDate" class="flex justify-between">
              <span class="text-slate-600">Publication Date:</span>
              <span class="font-medium">{{ formatDate(product.publicationDate) }}</span>
            </div>
            <div v-if="product.pages" class="flex justify-between">
              <span class="text-slate-600">Pages:</span>
              <span class="font-medium">{{ product.pages }}</span>
            </div>
            <div v-if="product.weight" class="flex justify-between">
              <span class="text-slate-600">Weight:</span>
              <span class="font-medium">{{ product.weight }} kg</span>
            </div>
          </div>
        </div>
  
        <!-- Course-specific details -->
        <div v-if="product.category === 'courses'" class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Course Details</h3>
          <div class="space-y-3">
            <div v-if="product.duration" class="flex justify-between">
              <span class="text-slate-600">Duration:</span>
              <span class="font-medium">{{ product.duration }} hours</span>
            </div>
            <div v-if="product.instructor" class="flex justify-between">
              <span class="text-slate-600">Instructor:</span>
              <span class="font-medium">{{ product.instructor }}</span>
            </div>
            <div v-if="product.videoUrl" class="flex justify-between">
              <span class="text-slate-600">Video:</span>
              <a :href="product.videoUrl" target="_blank" class="text-indigo-600 hover:text-indigo-700 inline-flex items-center space-x-1">
                <span>Preview</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
  
        <!-- Physical dimensions -->
        <div v-if="!product.isDigital && product.dimensions" class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Dimensions</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-slate-600">Length:</span>
              <span class="font-medium">{{ product.dimensions.length }} cm</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Width:</span>
              <span class="font-medium">{{ product.dimensions.width }} cm</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Height:</span>
              <span class="font-medium">{{ product.dimensions.height }} cm</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Features -->
      <div v-if="product.features?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Features</h3>
        <ul class="space-y-2">
          <li
            v-for="feature in product.features"
            :key="feature"
            class="flex items-start space-x-2"
          >
            <Check class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span class="text-slate-700">{{ feature }}</span>
          </li>
        </ul>
      </div>
  
      <!-- Tags -->
      <div v-if="product.tags?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </div>
  
      <!-- Digital Content -->
      <div v-if="product.isDigital" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Digital Content</h3>
        <div class="bg-slate-50 rounded-lg p-6 space-y-4">
          <div v-if="product.downloadUrl" class="flex items-center justify-between">
            <span class="text-slate-700">Download Link:</span>
            <a
              :href="product.downloadUrl"
              target="_blank"
              class="text-indigo-600 hover:text-indigo-700 inline-flex items-center space-x-1"
            >
              <Download class="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
          <div v-if="product.previewUrl" class="flex items-center justify-between">
            <span class="text-slate-700">Preview Link:</span>
            <a
              :href="product.previewUrl"
              target="_blank"
              class="text-indigo-600 hover:text-indigo-700 inline-flex items-center space-x-1"
            >
              <Eye class="w-4 h-4" />
              <span>Preview</span>
            </a>
          </div>
        </div>
      </div>
  
      <!-- Image Gallery -->
      <div v-if="product.imageGallery?.length" class="mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Gallery</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(image, index) in product.imageGallery"
            :key="index"
            class="aspect-video rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
            @click="openImageModal(image)"
          >
            <img
              :src="image"
              :alt="`Product image ${index + 1}`"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>
      </div>
  
      <!-- Image Modal -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="selectedImage"
            class="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
            @click="closeImageModal"
          >
            <div class="relative max-w-4xl max-h-full">
              <img
                :src="selectedImage"
                alt="Product image"
                class="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                @click="closeImageModal"
                class="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { 
    X, Edit, Package, DollarSign, Calendar, Eye, ShoppingCart, Star, 
    MessageSquare, Check, Download, ExternalLink
  } from 'lucide-vue-next'
  
  interface Props {
    product: any
  }
  
  defineProps<Props>()
  defineEmits(['close', 'edit'])
  
  const selectedImage = ref<string | null>(null)
  
  const openImageModal = (image: string) => {
    selectedImage.value = image
  }
  
  const closeImageModal = () => {
    selectedImage.value = null
  }
  
  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'draft': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }
  
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG').format(price)
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  </script>
  