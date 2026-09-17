<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" @click="close"></div>

          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="modelValue" class="inline-block w-full max-w-md p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-[2.5rem] shadow-sm border border-slate-200">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-black text-slate-900 tracking-normal ">{{ title }}</h3>
                  <p class="text-sm font-bold text-slate-400 tracking-normal mt-1">{{ message }}</p>
                </div>

                <div class="relative">
                  <input
                    v-model="inputValue"
                    type="text"
                    ref="inputRef"
                    class="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#033958] focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"

                    @keyup.enter="confirm"
                  />
                </div>

                <div class="flex gap-3 pt-2">
                  <button
                    @click="close"
                    type="button"
                    class="flex-1 px-6 py-4 text-sm font-black  tracking-normal text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    @click="confirm"
                    type="button"
                    class="flex-1 px-6 py-4 bg-[#033958] text-white rounded-2xl font-black text-sm  tracking-normal shadow-sm border border-slate-100 hover:bg-[#022a41] transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title: string
  message: string
  placeholder?: string
  initialValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [value: string]
}>()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    inputValue.value = props.initialValue || ''
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

const close = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm', inputValue.value)
  close()
}
</script>
