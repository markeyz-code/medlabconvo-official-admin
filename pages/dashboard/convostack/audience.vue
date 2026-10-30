<script setup lang="ts">
import ConvoStudioHeader from '@/components/convostack/ConvoStudioHeader.vue'
import ConvoAudience from '@/components/convostack/ConvoAudience.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'convostack:read',
})
</script>

<template>
  <div class="space-y-5">
    <ConvoStudioHeader active="audience" />
    <ConvoAudience />
  </div>
</template>
