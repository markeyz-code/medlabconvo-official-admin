<template>
  <div class="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-[#033958]/20 hover: hover:[#033958]/5 transition-all duration-500 relative flex flex-col h-full">
    <!-- Product Image Area -->
    <div class="relative h-56 bg-slate-50 overflow-hidden">
      <img
        v-if="product.imageUrl || product.images?.[0]"
        :src="product.imageUrl || product.images?.[0]"
        @error="$event.target.src = 'https://placehold.co/600x400/f8fafc/94a3b8?text=No+Image'"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <img
        v-else
        src="https://placehold.co/600x400/f8fafc/94a3b8?text=No+Image"
        alt="Placeholder"
        class="w-full h-full object-cover opacity-50 grayscale"
      />
      
      <!-- Badges Overlay -->
      <div class="absolute top-4 left-4 flex flex-col gap-2">
        <span :class="[
          'px-3 py-1.5 text-sm font-bold rounded-full backdrop-blur-md border',
          product.status === 'active' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200' : 
          product.status === 'inactive' ? 'bg-rose-500/10 text-rose-700 border-rose-200' :
          'bg-slate-500/10 text-slate-700 border-slate-200'
        ]">
          {{ product.status }}
        </span>
        <span v-if="product.isDigital" class="px-3 py-1.5 text-sm font-bold rounded-full bg-[#033958]/10 text-[#033958] border border-[#033958]/20 backdrop-blur-md inline-flex items-center space-x-1">
          <Icon name="lucide:download-cloud" class="w-3 h-3" />
          <span>Digital product</span>
        </span>
      </div>

      <div class="absolute top-4 right-4">
        <span class="px-3 py-1.5 text-sm font-bold rounded-full bg-white/90 text-slate-500 border border-slate-100">
          {{ product.category }}
        </span>
      </div>

      <!-- Sale Badge -->
      <div v-if="product.originalPrice && product.originalPrice > product.price" class="absolute bottom-4 right-4">
        <span class="px-3 py-2 text-sm font-bold bg-[#033958] text-white rounded-xl">
          -{{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}%
        </span>
      </div>
    </div>

    <!-- Content Area -->
    <div class="p-6 flex flex-col flex-1">
      <div class="mb-4">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="text-lg font-bold text-slate-900 group-hover:text-[#033958] transition-colors duration-300 line-clamp-1 leading-tight">
            {{ product.name }}
          </h3>
          <div class="flex items-center space-x-1 transition-opacity duration-300">
            <button @click="editProduct" class="p-2 text-slate-400 hover:text-[#033958] hover:bg-[#033958]/5 rounded-lg transition-all">
              <Icon name="lucide:pencil" class="w-4 h-4" />
            </button>
            <button @click="deleteProduct" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <Icon name="lucide:trash-2" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <p class="text-sm font-bold text-slate-400">by {{ product.author || 'MedLabConvo' }}</p>
      </div>

      <p class="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 flex-1">
        {{ product.description }}
      </p>

      <div class="flex items-baseline space-x-2 mb-6">
        <span class="text-lg font-black text-slate-900">₦{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice && product.originalPrice > product.price" class="text-sm font-bold text-slate-300 line-through">
          ₦{{ formatPrice(product.originalPrice) }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
        <div class="flex flex-col">
          <span class="text-[9px] font-bold text-slate-400">Inventory</span>
          <div class="flex items-center space-x-2 mt-1">
            <div :class="['w-1.5 h-1.5 rounded-full', product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500']"></div>
            <span class="text-sm font-bold text-slate-700">{{ product.stock }} Units</span>
          </div>
        </div>
        <div class="flex flex-col text-right">
          <span class="text-[9px] font-bold text-slate-400">Engagement</span>
          <div class="flex items-center justify-end space-x-3 mt-1 text-slate-500">
            <span class="flex items-center space-x-1">
              <Icon name="lucide:eye" class="w-3 h-3" />
              <span class="text-sm font-bold">{{ product.viewCount || 0 }}</span>
            </span>
            <span class="flex items-center space-x-1">
              <Icon name="lucide:shopping-bag" class="w-3 h-3" />
              <span class="text-sm font-bold">{{ product.salesCount || 0 }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center -space-x-2">
          <div v-for="i in 3" :key="i" class="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
            <img :src="`https://ui-avatars.com/api/?name=User+${i}&background=random`" class="w-full h-full object-cover" />
          </div>
          <span class="ml-4 text-sm font-bold text-slate-400 tracking-tight">+{{ product.salesCount || 0 }} reviews</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="updateStock(-1)"
            :disabled="product.stock <= 0"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 transition-all border border-slate-100"
          >
            <Icon name="lucide:minus" class="w-4 h-4" />
          </button>
          <button 
            @click="updateStock(1)"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-green-500 hover:bg-green-50 transition-all border border-slate-100"
          >
            <Icon name="lucide:plus" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/Icon.vue'

interface Props {
  product: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  view: [product: any]
  edit: [product: any]
  delete: [product: any]
  'update-stock': [productId: string, newStock: number]
}>()

const updateStock = (change: number) => {
  const newValue = (props.product.stock || 0) + change
  if (newValue >= 0) {
    emit('update-stock', props.product.id || props.product._id, newValue)
  }
}

const viewProduct = () => emit('view', props.product)
const editProduct = () => emit('edit', props.product)
const deleteProduct = () => emit('delete', props.product)

const formatPrice = (price: number) => {
  if (!price) return '0.00'
  return new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)
}
</script>