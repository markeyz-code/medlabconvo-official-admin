<template>
  <DashboardOverview />
</template>

<script setup lang="ts">
import DashboardOverview from '~/components/DashboardOverview.vue'


// Meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
