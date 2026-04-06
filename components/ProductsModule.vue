<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div class="w-full sm:w-72">
          <AnimatedInput
            v-model="searchQuery"
            id="search-products"
            label="Search products"
            type="text"
            @input="debouncedSearch"
          />
        </div>
        <div class="w-full sm:w-48">
          <SelectInput
            v-model="selectedCategory"
            label="Category"
            :options="categoryOptions"
            @change="applyFilters"
          />
        </div>
      </div>
      <div class="flex items-center space-x-4 w-full md:w-auto">
        <button
          @click="showBatchModal = true"
          class="flex-1 md:flex-none px-6 py-3 border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm flex items-center justify-center space-x-2"
        >
          <Icon name="lucide:upload" class="w-5 h-4" />
          <span>Batch Import</span>
        </button>
        <button
          @click="openCreateModal"
          class="flex-1 md:flex-none px-6 py-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all duration-300 flex items-center justify-center space-x-3 group"
        >
          <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span class="font-bold text-sm">Add Product</span>
        </button>
      </div>
    </div>

    <!-- Quick Filters -->
    <div class="flex flex-wrap items-center gap-3 py-4 border-y border-slate-50">
      <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Quick filters:</span>
      <button
        v-for="filter in quickFilters"
        :key="filter.id"
        @click="handleQuickFilter(filter.id)"
        :class="[
          'px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 border',
          activeQuickFilter === filter.id 
            ? 'bg-[#033958] text-white border-[#033958]' 
            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
        ]"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in productStatsList" :key="stat.title" class="p-6 bg-white rounded-3xl border border-slate-100 flex items-center space-x-4">
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center', stat.bg]">
          <Icon :name="stat.icon" :class="['w-6 h-6', stat.color]" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{{ stat.title }}</p>
          <p class="text-xl font-bold text-slate-900 tracking-tight">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="allProductsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="i in 8" :key="i" class="bg-slate-50 rounded-2xl h-80 animate-pulse"></div>
    </div>

    <div v-else-if="currentProducts?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <ProductCard
        v-for="product in currentProducts"
        :key="product.id || product._id"
        :product="product"
        @edit="editProduct"
        @delete="deleteProductConfirm"
        @view="viewProduct"
        @update-stock="handleUpdateStock"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
      <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
        <Icon name="lucide:shopping-bag" class="w-10 h-10 text-slate-100" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No products found</h3>
      <p class="text-slate-500 mb-8 max-w-xs text-center leading-relaxed font-medium">Your inventory is currently empty. Add your first product to get started.</p>
      <button
        @click="openCreateModal"
        class="px-8 py-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all font-bold text-sm"
      >
        Add first product
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="currentProducts?.length && totalProductCount > perPage" class="flex items-center justify-between pt-8 border-t border-slate-100">
      <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">Page {{ currentPageNumber }}</span>
      <div class="flex items-center space-x-4">
        <button 
          @click="changePage(currentPageNumber - 1)"
          :disabled="currentPageNumber === 1"
          class="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5" />
        </button>
        <button 
          @click="changePage(currentPageNumber + 1)"
          :disabled="currentPageNumber * perPage >= totalProductCount"
          class="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors"
        >
          <Icon name="lucide:arrow-right" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Modals & SlideOvers -->
    <SlideOver v-model="showCreateModal" :title="editingProduct ? 'Edit product' : 'Add product'">
      <div class="p-8">
        <ProductForm
          :product="editingProduct"
          @saved="handleProductSaved"
          @cancel="closeCreateModal"
        />
      </div>
    </SlideOver>

    <Modal v-model="showBatchModal" title="Batch import products" size="lg">
      <div class="p-8">
        <BatchImportForm @imported="handleBatchImported" @cancel="showBatchModal = false" />
      </div>
    </Modal>

    <Modal v-model="showDeleteModal" title="Delete product" size="sm">
      <div class="p-8 text-center space-y-6">
        <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
          <Icon name="lucide:alert-triangle" class="w-8 h-8" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900">Delete product?</h3>
          <p class="text-sm text-slate-500 mt-2 font-medium">This will permanently remove <span class="font-bold text-slate-900">{{ deletingProduct?.name }}</span> from your inventory.</p>
        </div>
        <div class="flex items-center gap-3 pt-4 border-t border-slate-50">
          <button @click="showDeleteModal = false" class="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-900">Cancel</button>
          <button @click="confirmDelete" class="flex-1 py-3 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all">Delete product</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useGetProducts } from "@/composables/modules/products/useGetProducts"
import { useGetProductStats } from "@/composables/modules/products/useGetProductStats"
import { useGetInStockProducts } from "@/composables/modules/products/useGetInStockProducts"
import { useGetOutOfStockProducts } from "@/composables/modules/products/useGetOutOfStockProducts"
import { useGetFeaturedProducts } from "@/composables/modules/products/useGetFeaturedProducts"
import { useGetBestSellers } from "@/composables/modules/products/useGetBestSellers"
import { useGetNewArrivals } from "@/composables/modules/products/useGetNewArrivals"
import { useGetProductsOnSale } from "@/composables/modules/products/useGetProductsOnSale"
import { useGetDigitalProducts } from "@/composables/modules/products/useGetDigitalProducts"
import { useSearchProducts } from "@/composables/modules/products/useSearchProducts"
import { useDeleteProduct } from "@/composables/modules/products/useDeleteProduct"
import { useUpdateProductStock } from "@/composables/modules/products/useUpdateProductStock"
import { useCustomToast } from '@/composables/core/useCustomToast'
import Icon from '@/components/Icon.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductForm from '@/components/ProductForm.vue'
import SlideOver from '@/components/SlideOver.vue'
import Modal from '@/components/Modal.vue'
import BatchImportForm from '@/components/BatchImportForm.vue'

// Logic
const { products, loading: productsLoading, totalCount, currentPage, filters, getProducts } = useGetProducts()
const { stats, loading: productStatsLoading } = useGetProductStats()
const { inStockProducts, loading: inStockLoading, getInStockProducts } = useGetInStockProducts()
const { outOfStockProducts, loading: outOfStockLoading, getOutOfStockProducts } = useGetOutOfStockProducts()
const { featuredProducts, getFeaturedProducts } = useGetFeaturedProducts()
const { bestSellers, getBestSellers } = useGetBestSellers()
const { newArrivals, getNewArrivals } = useGetNewArrivals()
const { productsOnSale, getProductsOnSale } = useGetProductsOnSale()
const { digitalProducts, getDigitalProducts } = useGetDigitalProducts()
const { searchResults, loading: searchLoading, searchProducts: performSearch, resetState: resetSearch } = useSearchProducts()
const { deleteProduct, success: deleteSuccess } = useDeleteProduct()
const { updateProductStock: updateStock, success: updateStockSuccess } = useUpdateProductStock()
const { showToast } = useCustomToast()

// State
const searchQuery = ref('')
const selectedCategory = ref('')
const activeQuickFilter = ref('')
const showCreateModal = ref(false)
const showBatchModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref<any>(null)
const deletingProduct = ref<any>(null)
const perPage = 12

const categoryOptions = computed(() => {
  const options = [{ label: 'All categories', value: '' }]
  filters.value?.categories?.forEach((c: any) => options.push({ label: c.name, value: c.name }))
  return options
})

const quickFilters = [
  { id: 'featured', label: 'Featured' },
  { id: 'bestsellers', label: 'Best sellers' },
  { id: 'new', label: 'New arrivals' },
  { id: 'sale', label: 'On sale' },
  { id: 'digital', label: 'Digital' }
]

const productStatsList = computed(() => [
  { title: 'Total products', value: products.value?.length || 0, icon: 'lucide:terminal', color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'In stock', value: inStockProducts.value?.length || 0, icon: 'lucide:badge-check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'Out of stock', value: outOfStockProducts.value?.length || 0, icon: 'lucide:alert-circle', color: 'text-rose-600', bg: 'bg-rose-50' },
  { title: 'Total sales', value: stats.value?.totalSales || 0, icon: 'lucide:rocket', color: 'text-indigo-600', bg: 'bg-indigo-50' }
])

const currentProducts = computed(() => {
  if (searchQuery.value && searchResults.value) return searchResults.value
  switch (activeQuickFilter.value) {
    case 'featured': return featuredProducts.value
    case 'bestsellers': return bestSellers.value
    case 'new': return newArrivals.value
    case 'sale': return productsOnSale.value
    case 'digital': return digitalProducts.value
    default: return products.value
  }
})

const totalProductCount = computed(() => searchQuery.value ? searchResults.value?.length || 0 : totalCount.value || 0)
const currentPageNumber = computed(() => currentPage.value || 1)
const allProductsLoading = computed(() => productsLoading.value || searchLoading.value)

// Actions
const loadProducts = (page = 1) => {
  activeQuickFilter.value = ''
  getProducts({ page, limit: perPage, category: selectedCategory.value })
}

const handleQuickFilter = (id: string) => {
  activeQuickFilter.value = id
  searchQuery.value = ''
  switch (id) {
    case 'featured': getFeaturedProducts(); break
    case 'bestsellers': getBestSellers(); break
    case 'new': getNewArrivals(); break
    case 'sale': getProductsOnSale(); break
    case 'digital': getDigitalProducts(); break
  }
}

const debouncedSearch = useDebounceFn(async () => {
  if (searchQuery.value.trim()) {
    activeQuickFilter.value = ''
    await performSearch({ query: searchQuery.value, limit: perPage })
  } else {
    resetSearch()
    loadProducts(1)
  }
}, 400)

const applyFilters = () => loadProducts(1)
const changePage = (page: number) => loadProducts(page)

const openCreateModal = () => { editingProduct.value = null; showCreateModal.value = true }
const editProduct = (product: any) => { editingProduct.value = product; showCreateModal.value = true }
const closeCreateModal = () => { showCreateModal.value = false; editingProduct.value = null }
const viewProduct = (product: any) => { /* Optional: Navigate to detail */ }

const deleteProductConfirm = (product: any) => { deletingProduct.value = product; showDeleteModal.value = true }
const confirmDelete = async () => {
  await deleteProduct(deletingProduct.value.id || deletingProduct.value._id)
  if (deleteSuccess.value) {
    showDeleteModal.value = false
    loadProducts(currentPageNumber.value)
  }
}

const handleUpdateStock = async (productId: string, newStock: number) => {
  await updateStock(productId, { stock: newStock })
  if (updateStockSuccess.value) loadProducts(currentPageNumber.value)
}

const handleProductSaved = () => { closeCreateModal(); loadProducts(currentPageNumber.value) }
const handleBatchImported = () => { showBatchModal.value = false; loadProducts(1) }

onMounted(() => {
  getProducts()
  getInStockProducts()
  getOutOfStockProducts()
})
</script>
