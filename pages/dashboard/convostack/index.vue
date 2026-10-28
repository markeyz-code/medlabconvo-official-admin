<template>
  <div>
    <ConvoStackModule />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'convostack:read'
})
import ConvoStackModule from '@/components/convostack/ConvoStackModule.vue'
</script>
