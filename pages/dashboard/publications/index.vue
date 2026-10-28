<template>
    <PublicationsList />
  </template>
  
  <script setup lang="ts">
  
  
 definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'publications:read'
})
  </script>
  