<template>
  <TeamsModule />
</template>

<script setup lang="ts">
import TeamsModule from '~/components/TeamsModule.vue'
import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
