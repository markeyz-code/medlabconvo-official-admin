<template>
  <TeamsModule />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

import TeamsModule from '~/components/TeamsModule.vue'
</script>
