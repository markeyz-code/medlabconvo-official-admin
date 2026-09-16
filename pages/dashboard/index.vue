<template>
  <DashboardOverview />
</template>

<script setup lang="ts">
import DashboardOverview from '~/components/DashboardOverview.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
