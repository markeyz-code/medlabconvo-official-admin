<template>
    <TeamsModule />
  </template>
  
  <script setup lang="ts">
  import TeamsModule from '~/components/TeamsModule.vue'
  
  
 definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  </script>
  