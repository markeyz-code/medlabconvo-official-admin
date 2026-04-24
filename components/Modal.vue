<template>
  <SlideOver :modelValue="modelValue" @update:modelValue="val => emit('update:modelValue', val)" :title="title" size="full">
    <slot />
  </SlideOver>
</template>

<script setup lang="ts">
import SlideOver from './SlideOver.vue'

interface Props {
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits(['update:modelValue'])
</script>