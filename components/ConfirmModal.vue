<template>
  <Modal :model-value="modelValue" :title="title" size="sm" @update:model-value="$emit('update:modelValue', $event)">
    <div class="confirm-body">
      <div class="confirm-symbol" :class="confirmTone === 'danger' ? 'is-danger' : 'is-brand'">
        <AlertTriangle v-if="confirmTone === 'danger'" class="w-6 h-6" />
        <HelpCircle v-else class="w-6 h-6" />
      </div>
      <p class="confirm-message">{{ message }}</p>
    </div>

    <template #footer>
      <button type="button" class="btn btn-outline w-full sm:w-auto" @click="$emit('update:modelValue', false)">
        {{ cancelText }}
      </button>
      <button
        type="button"
        :class="['btn', confirmTone === 'danger' ? 'btn-danger' : 'btn-primary', 'w-full sm:w-auto']"
        :disabled="loading"
        @click="$emit('confirm')"
      >
        <span v-if="loading" class="confirm-spinner"></span>
        {{ loading ? 'Working…' : confirmText }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { AlertTriangle, HelpCircle } from 'lucide-vue-next'
import Modal from '~/components/Modal.vue'

interface Props {
  modelValue: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmClass?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmClass: '',
  loading: false,
})

defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const confirmTone = computed(() => {
  if (props.confirmClass?.includes('rose') || props.confirmClass?.includes('red') || props.confirmClass?.includes('danger')) {
    return 'danger'
  }
  return 'danger'
})
</script>

<style scoped>
.confirm-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  padding: 10px 4px 6px;
}
.confirm-symbol {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
}
.confirm-symbol.is-danger {
  background: var(--mc-danger-soft);
  color: var(--mc-danger);
}
.confirm-symbol.is-brand {
  background: var(--mc-brand-50);
  color: var(--mc-brand);
}
.confirm-message {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--mc-muted);
  max-width: 360px;
}
.confirm-spinner {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
