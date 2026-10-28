<template>
  <TeamsModule />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'teams:read'
})

import TeamsModule from '~/components/TeamsModule.vue'
</script>
