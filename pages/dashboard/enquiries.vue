<template>
    <EnquiriesModule />
  </template>
  
  <script setup lang="ts">
  import EnquiriesModule from '~/components/EnquiriesModule.vue'
  
  
 definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  </script>
  