<template>
  <Teleport to="body">
    <Transition name="sheet-root">
      <div v-if="modelValue" class="sheet-root" role="dialog" aria-modal="true" :aria-label="title">
        <div class="sheet-backdrop" @click="handleBackdrop" />

        <Transition name="sheet-panel" appear>
          <section
            v-if="modelValue"
            :class="['sheet-panel', sizeClass]"
            @click.stop
          >
            <div class="sheet-grabber" aria-hidden="true"><span /></div>

            <header class="sheet-head">
              <div class="sheet-head-copy">
                <p v-if="eyebrow" class="sheet-eyebrow">{{ eyebrow }}</p>
                <h2 class="sheet-title">{{ title }}</h2>
                <p v-if="description" class="sheet-description">{{ description }}</p>
              </div>
              <button class="sheet-close" type="button" aria-label="Close panel" @click="close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div class="sheet-body scrollbar-slim">
              <slot />
            </div>

            <footer v-if="$slots.footer" class="sheet-footer">
              <slot name="footer" />
            </footer>
          </section>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    eyebrow?: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    closeOnBackdrop?: boolean
  }>(),
  {
    eyebrow: '',
    description: '',
    size: 'lg',
    closeOnBackdrop: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClass = computed(() => `sheet-${props.size}`)

let lockCount = 0

const lock = () => {
  if (typeof document === 'undefined') return
  lockCount += 1
  document.body.style.overflow = 'hidden'
  document.body.classList.add('modal-open')
}
const unlock = () => {
  if (typeof document === 'undefined') return
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = ''
    document.body.classList.remove('modal-open')
  }
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) close()
}

watch(
  () => props.modelValue,
  (open) => {
    if (typeof window === 'undefined') return
    if (open) {
      lock()
      window.addEventListener('keydown', onKeydown)
    } else {
      unlock()
      window.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true },
)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdrop = () => {
  if (props.closeOnBackdrop) close()
}

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
  if (props.modelValue) unlock()
})
</script>

<style scoped>
.sheet-root {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.sheet-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(5, 27, 42, 0.46);
  backdrop-filter: blur(7px) saturate(120%);
  -webkit-backdrop-filter: blur(7px) saturate(120%);
}

.sheet-panel {
  position: relative;
  width: calc(100% - 16px);
  max-height: 92dvh;
  margin: 0 8px calc(8px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--mc-border);
  border-radius: 22px;
  box-shadow: 0 32px 90px -32px rgba(4, 29, 47, 0.55), 0 4px 18px -8px rgba(4, 29, 47, 0.16);
  overflow: hidden;
  transform-origin: bottom center;
}

.sheet-grabber {
  display: flex;
  justify-content: center;
  padding: 9px 0 3px;
  flex-shrink: 0;
}
.sheet-grabber span {
  width: 40px;
  height: 4px;
  border-radius: 99px;
  background: #dbe6ee;
}

.sheet-head {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 18px 15px;
  border-bottom: 1px solid var(--mc-border);
  background: #fff;
}

.sheet-head-copy {
  min-width: 0;
}
.sheet-eyebrow {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--mc-brand);
  font-weight: 700;
  margin-bottom: 3px;
}
.sheet-title {
  font-family: var(--mc-font-heading);
  font-size: 18px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--mc-ink);
  margin: 0;
}
.sheet-description {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--mc-muted);
}

.sheet-close {
  width: 33px;
  height: 33px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--mc-muted);
  background: #f7fafc;
  border: 1px solid var(--mc-border);
  transition: all 0.18s ease;
}
.sheet-close:hover {
  color: var(--mc-danger);
  background: var(--mc-danger-soft);
  border-color: #fecaca;
}

.sheet-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 22px 26px;
  -webkit-overflow-scrolling: touch;
}

.sheet-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--mc-border);
  background: #fbfdfe;
}

/* Transition */
.sheet-root-enter-active,
.sheet-root-leave-active {
  transition: opacity 0.22s ease;
}
.sheet-root-enter-from,
.sheet-root-leave-to {
  opacity: 0;
}

.sheet-panel-enter-active {
  transition: transform 0.34s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
}
.sheet-panel-leave-active {
  transition: transform 0.22s cubic-bezier(0.4, 0, 1, 1), opacity 0.16s ease;
}
.sheet-panel-enter-from,
.sheet-panel-leave-to {
  opacity: 0;
  transform: translateY(26px) scale(0.99);
}

/* Floating desktop panel — never glued to the viewport edge. */
@media (min-width: 768px) {
  .sheet-root {
    padding: 20px;
    align-items: stretch;
  }
  .sheet-panel {
    width: 100%;
    height: calc(100dvh - 40px);
    max-height: none;
    margin: 0 0 0 auto;
    border-radius: 20px;
    transform-origin: right center;
  }
  .sheet-grabber {
    display: none;
  }
  .sheet-head {
    padding: 18px 22px 15px;
  }
  .sheet-title {
    font-size: 20px;
  }
  .sheet-body {
    padding: 20px 22px 26px;
  }
  .sheet-footer {
    padding: 14px 22px;
  }
  .sheet-panel-enter-from,
  .sheet-panel-leave-to {
    opacity: 0;
    transform: translateX(34px) scale(0.985);
  }
}

/* Compact drawer widths. `full` is intentionally not full-viewport. */
.sheet-sm {
  max-width: 380px;
}
.sheet-md {
  max-width: 460px;
}
.sheet-lg {
  max-width: 560px;
}
.sheet-xl {
  max-width: 620px;
}
.sheet-full {
  max-width: 680px;
}

@media (max-width: 767px) {
  .sheet-panel {
    max-width: none;
  }
}
</style>
