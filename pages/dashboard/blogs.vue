<template>
    <BlogsModule />
  </template>
  
  <script setup lang="ts">
  import BlogsModule from '~/components/BlogsModule.vue'
  
  
 definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  </script>
  