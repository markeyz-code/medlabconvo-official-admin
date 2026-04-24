<template>
    <PublicationsList />
  </template>
  
  <script setup lang="ts">
  import { definePageMeta } from '#imports'
  
  definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  </script>
  