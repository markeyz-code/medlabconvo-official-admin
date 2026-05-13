<template>
    <AuditModule />
  </template>
  
  <script setup lang="ts">
  import AuditModule from '~/components/AuditModule.vue'
  
  
 definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  </script>
  