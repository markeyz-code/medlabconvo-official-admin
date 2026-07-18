<template>
  <DashboardOverview />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

import DashboardOverview from '~/components/DashboardOverview.vue'
</script>
