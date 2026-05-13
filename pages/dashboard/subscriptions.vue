<template>
    <SubscriptionsModule />
  </template>
  
  <script setup lang="ts">
  import SubscriptionsModule from '~/components/SubscriptionsModule.vue'
  
  
 definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  </script>
  