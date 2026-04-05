<template>
    <div class="space-y-6">
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Batch Import Products</h3>
        <p class="text-sm text-gray-600">Upload a CSV file to import multiple products at once</p>
      </div>
  
      <!-- File Upload -->
      <div
        @click="triggerFileUpload"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleFileDrop"
        class="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-indigo-400 transition-all duration-200 cursor-pointer group"
        :class="{ 'border-indigo-500 bg-indigo-50': dragOver }"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          class="hidden"
          @change="handleFileUpload"
        />
        
        <div v-if="!uploading && !selectedFile" class="text-center">
          <Upload class="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          <div class="mt-4">
            <p class="text-sm text-gray-600">
              <span class="font-medium text-indigo-600 hover:text-indigo-700">Click to upload</span>
              or drag and drop
            </p>
            <p class="text-sm text-gray-900 mt-1">CSV files only</p>
          </div>
        </div>
  
        <div v-else-if="uploading" class="text-center">
          <Loader2 class="mx-auto h-8 w-8 text-indigo-600 animate-spin" />
          <p class="mt-2 text-sm text-gray-600">Processing file...</p>
        </div>
  
        <div v-else-if="selectedFile" class="text-center">
          <FileText class="mx-auto h-12 w-12 text-green-600" />
          <div class="mt-4">
            <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-900">{{ formatFileSize(selectedFile.size) }}</p>
          </div>
        </div>
      </div>
  
      <!-- CSV Template Download -->
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <Info class="w-5 h-5 text-blue-600 mt-0.5" />
          <div class="flex-1">
            <h4 class="text-sm font-medium text-blue-900">Need a template?</h4>
            <p class="text-sm text-blue-700 mt-1">
              Download our CSV template to ensure your data is formatted correctly.
            </p>
            <button
              @click="downloadTemplate"
              class="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1"
            >
              <Download class="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Preview -->
      <div v-if="previewData?.length" class="space-y-4">
        <h4 class="font-medium text-gray-900">Preview ({{ previewData.length }} products)</h4>
        <div class="max-h-64 overflow-auto border border-gray-200 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900 ">Name</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900 ">Category</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900 ">Author</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900 ">Price</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900 ">Stock</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in previewData.slice(0, 5)" :key="index">
                <td class="px-4 py-2 text-sm text-gray-900">{{ item.name }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ item.category }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ item.author }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">₦{{ formatPrice(item.price) }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ item.stock }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="previewData.length > 5" class="px-4 py-2 text-sm text-gray-900 bg-gray-50 text-center">
            +{{ previewData.length - 5 }} more products
          </div>
        </div>
      </div>
  
      <!-- Error Messages -->
      <div v-if="errors.length" class="bg-red-50 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <AlertCircle class="w-5 h-5 text-red-600 mt-0.5" />
          <div class="flex-1">
            <h4 class="text-sm font-medium text-red-900">Validation Errors</h4>
            <ul class="mt-2 text-sm text-red-700 space-y-1">
              <li v-for="error in errors.slice(0, 5)" :key="error">{{ error }}</li>
            </ul>
            <p v-if="errors.length > 5" class="text-sm text-red-600 mt-1">
              +{{ errors.length - 5 }} more errors
            </p>
          </div>
        </div>
      </div>
  
      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button
          @click="emit('cancel')"
          type="button"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleImport"
          :disabled="!previewData?.length || errors.length > 0 || importing"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
        >
          <Loader2 v-if="importing" class="w-4 h-4 animate-spin" />
          <span>Import {{ previewData?.length || 0 }} Products</span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Upload, Loader2, FileText, Info, Download, AlertCircle } from 'lucide-vue-next'
  import { useBatchCreateProducts } from "@/composables/modules/products/useBatchCreateProducts"

  const emit = defineEmits(['imported', 'cancel'])
  
  const fileInput = ref<HTMLInputElement>()
  const dragOver = ref(false)
  const uploading = ref(false)
  const importing = ref(false)
  const selectedFile = ref<File | null>(null)
  const previewData = ref<any[]>([])
  const errors = ref<string[]>([])
  
  // Composables
  const {
    loading: batchLoading,
    error: batchError,
    success: batchSuccess,
    products: batchedProducts,
    batchCreateProducts: performBatchCreate,
    resetState: resetBatchState
  } = useBatchCreateProducts()
  
  const triggerFileUpload = () => {
    fileInput.value?.click()
  }
  
  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }
  
  const handleFileDrop = async (event: DragEvent) => {
    dragOver.value = false
    const file = event.dataTransfer?.files?.[0]
    if (file && file.type === 'text/csv') {
      await processFile(file)
    }
  }
  
  const processFile = async (file: File) => {
    selectedFile.value = file
    uploading.value = true
    errors.value = []
    
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const requiredHeaders = ['name', 'category', 'author', 'price', 'stock']
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
      
      if (missingHeaders.length > 0) {
        errors.value.push(`Missing required columns: ${missingHeaders.join(', ')}`)
        return
      }
      
      const data = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row: any = {}
        
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        
        // Validate required fields
        if (!row.name) {
          errors.value.push(`Row ${i + 1}: Name is required`)
          continue
        }
        if (!row.category) {
          errors.value.push(`Row ${i + 1}: Category is required`)
          continue
        }
        if (!row.author) {
          errors.value.push(`Row ${i + 1}: Author is required`)
          continue
        }
        if (!row.price || isNaN(Number(row.price))) {
          errors.value.push(`Row ${i + 1}: Valid price is required`)
          continue
        }
        if (!row.stock || isNaN(Number(row.stock))) {
          errors.value.push(`Row ${i + 1}: Valid stock quantity is required`)
          continue
        }
        
        // Convert numeric fields
        row.price = Number(row.price)
        row.stock = Number(row.stock)
        row.originalPrice = row.originalPrice ? Number(row.originalPrice) : undefined
        row.pages = row.pages ? Number(row.pages) : undefined
        row.weight = row.weight ? Number(row.weight) : undefined
        row.duration = row.duration ? Number(row.duration) : undefined
        
        // Convert boolean fields
        row.isDigital = row.isDigital === 'true' || row.isDigital === '1'
        
        // Set defaults
        row.status = row.status || 'draft'
        row.availability = row.availability || 'available'
        
        // Parse arrays
        if (row.tags) {
          row.tags = row.tags.split(';').map((t: string) => t.trim()).filter((t: string) => t)
        }
        if (row.features) {
          row.features = row.features.split(';').map((f: string) => f.trim()).filter((f: string) => f)
        }
        
        data.push(row)
      }
      
      previewData.value = data
    } catch (error) {
      errors.value.push('Failed to parse CSV file')
    } finally {
      uploading.value = false
    }
  }
  
  const handleImport = async () => {
    if (!previewData.value?.length) return
    
    importing.value = true
    try {
      await performBatchCreate(previewData.value)
      if (batchSuccess.value) {
        emit('imported')
      }
    } finally {
      importing.value = false
    }
  }
  
  const downloadTemplate = () => {
    const headers = [
      'name', 'description', 'category', 'author', 'price', 'originalPrice', 
      'stock', 'status', 'availability', 'isDigital', 'imageUrl', 'tags', 
      'features', 'isbn', 'publisher', 'publicationDate', 'pages', 'weight',
      'duration', 'instructor', 'downloadUrl', 'previewUrl'
    ]
    
    const csvContent = headers.join(',') + '\n' +
      'Sample Book,A sample book description,books,John Doe,2500,3000,50,active,available,true,https://example.com/image.jpg,tag1;tag2,feature1;feature2,978-123-456-789-0,Sample Publisher,2024-01-01,300,0.5,,,https://example.com/download.pdf,https://example.com/preview.pdf'
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }
  
  const handleDragOver = () => {
    dragOver.value = true
  }
  
  const handleDragLeave = () => {
    dragOver.value = false
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG').format(price)
  }
  </script>
  