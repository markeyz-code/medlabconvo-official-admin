<template>
  <div class="space-y-5">
    <ConvoStudioHeader active="posts" />
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
import ConvoStudioHeader from '@/components/convostack/ConvoStudioHeader.vue'
</script>
