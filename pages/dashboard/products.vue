<template>
  <div class="">
    <!-- <header class="flex flex-col space-y-2">
      <h1 class="text-2xl font-black text-slate-900 tracking-tighter uppercase">Inventory & Marketplace</h1>
      <p class="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-2xl">
        Manage your scientific assets, digital content, and laboratory supplies with precision-grade controls.
      </p>
    </header> -->

    <ProductsModule />
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import ProductsModule from '@/components/ProductsModule.vue'

definePageMeta({
  layout: 'dashboard'
})
</script>