<template>
  <Modal
    :model-value="modelValue"
    :title="title"
    :description="message"
    size="sm"
    @update:model-value="close"
  >
    <input
      ref="inputRef"
      v-model="inputValue"
      type="text"
      :placeholder="placeholder"
      class="input"
      @keyup.enter="confirm"
    />
    <template #footer>
      <button type="button" class="btn btn-outline" @click="close">Cancel</button>
      <button type="button" class="btn btn-primary" @click="confirm">Confirm</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'

const props = defineProps<{
  modelValue: boolean
  title: string
  message: string
  placeholder?: string
  initialValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [value: string]
}>()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    inputValue.value = props.initialValue || ''
    nextTick(() => inputRef.value?.focus())
  },
)

const close = () => emit('update:modelValue', false)
const confirm = () => {
  emit('confirm', inputValue.value)
  close()
}
</script>
