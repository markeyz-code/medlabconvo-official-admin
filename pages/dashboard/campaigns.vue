<template>
  <CampaignsModule />
</template>

<script setup lang="ts">
import CampaignsModule from '~/components/CampaignsModule.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
