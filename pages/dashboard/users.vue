<template>
    <UsersModule />
  </template>
  
  <script setup lang="ts">
  import UsersModule from '~/components/UsersModule.vue'
  
  
 definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  </script>
  