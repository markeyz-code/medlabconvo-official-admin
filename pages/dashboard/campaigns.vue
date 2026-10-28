<template>
  <CampaignsModule />
</template>

<script setup lang="ts">
import CampaignsModule from '~/components/CampaignsModule.vue'


definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'campaigns:read'
})
</script>
