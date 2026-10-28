<template>
  <div :class="['admin-empty-state', { 'is-compact': compact, 'is-card': card }]">
    <div class="admin-empty-icon">
      <Icon :name="icon" class="w-6 h-6" />
    </div>
    <h3 class="admin-empty-title">{{ title }}</h3>
    <p v-if="description" class="admin-empty-copy">{{ description }}</p>
    <div v-if="$slots.default" class="admin-empty-actions">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'

withDefaults(
  defineProps<{
    icon?: string
    title: string
    description?: string
    compact?: boolean
    card?: boolean
  }>(),
  {
    icon: 'lucide:inbox',
    description: '',
    compact: false,
    card: false,
  },
)
</script>
