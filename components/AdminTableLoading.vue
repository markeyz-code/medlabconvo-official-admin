<template>
  <div
    :class="['admin-table-loading', { 'is-overlay': overlay, 'is-card': card }]"
    :style="{ '--columns': columns }"
    role="status"
    aria-live="polite"
  >
    <div class="atl-head" aria-hidden="true">
      <span v-for="index in columns" :key="`head-${index}`" class="atl-line" />
    </div>
    <div v-for="row in rows" :key="`row-${row}`" class="atl-row" aria-hidden="true">
      <span
        v-for="index in columns"
        :key="`cell-${row}-${index}`"
        class="atl-line"
        :style="{ width: `${index === 1 ? 78 : 52 + ((row + index) % 3) * 9}%` }"
      />
    </div>
    <span v-if="label" class="atl-label">
      <span class="atl-spinner" />
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    columns?: number
    rows?: number
    label?: string
    overlay?: boolean
    card?: boolean
  }>(),
  {
    columns: 5,
    rows: 6,
    label: '',
    overlay: false,
    card: false,
  },
)
</script>
