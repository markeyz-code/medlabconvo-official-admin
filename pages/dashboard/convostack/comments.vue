<script setup lang="ts">
import ConvoStudioHeader from '@/components/convostack/ConvoStudioHeader.vue'
import ConvoComments from '@/components/convostack/ConvoComments.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'convostack:read',
})
</script>

<template>
  <div class="space-y-5">
    <ConvoStudioHeader active="comments" />
    <ConvoComments />
  </div>
</template>
