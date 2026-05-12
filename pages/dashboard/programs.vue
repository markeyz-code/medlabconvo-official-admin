<template>
    <ProgramsList />
  </template>
  
  <script setup lang="ts">
  import ProgramsModule from '~/components/ProgramsModule.vue'
  
  
  definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  </script>
  