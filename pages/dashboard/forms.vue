<template>
    <FormsModule />
  </template>
  
  <script setup lang="ts">
  import FormsModule from '~/components/FormsModule.vue'
  
  
  definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  </script>
  