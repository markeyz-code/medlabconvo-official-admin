<script setup lang="ts">
import ConvoStudioHeader from '@/components/convostack/ConvoStudioHeader.vue'
import ConvoSettings from '@/components/convostack/ConvoSettings.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'convostack:read',
})
</script>

<template>
  <div class="space-y-5">
    <ConvoStudioHeader active="settings" />
    <ConvoSettings />
  </div>
</template>
