<template>
  <Teleport to="body">
    <Transition name="modal-root">
      <div
        v-if="modelValue"
        class="modal-root"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click.self="handleBackdropClick"
      >
        <div class="modal-backdrop" @click="handleBackdropClick"></div>

        <Transition name="modal-panel" appear>
          <div
            v-if="modelValue"
            :class="['modal-panel', sizeClass]"
            @click.stop
          >
            <!-- Mobile drag handle -->
            <div class="modal-grabber" aria-hidden="true">
              <span></span>
            </div>

            <header class="modal-head">
              <div class="modal-head-copy">
                <p v-if="eyebrow" class="modal-eyebrow">{{ eyebrow }}</p>
                <h3 class="modal-title">{{ title }}</h3>
                <p v-if="description" class="modal-description">{{ description }}</p>
              </div>
              <button
                class="modal-close"
                type="button"
                aria-label="Close dialog"
                @click="close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div class="modal-body scrollbar-slim" :class="paddingClass">
              <slot />
            </div>

            <footer v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

interface Props {
  modelValue: boolean
  title: string
  eyebrow?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  closeOnOutsideClick?: boolean
  paddingClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: '',
  description: '',
  size: 'md',
  closeOnOutsideClick: true,
  paddingClass: 'p-5 sm:p-6',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClass = computed(
  () =>
    ({
      sm: 'modal-sm',
      md: 'modal-md',
      lg: 'modal-lg',
      xl: 'modal-xl',
      '2xl': 'modal-2xl',
      full: 'modal-full',
    })[props.size],
)

let lockCount = 0

const lockScroll = () => {
  if (typeof document === 'undefined') return
  lockCount += 1
  document.body.style.overflow = 'hidden'
  document.body.classList.add('modal-open')
}

const unlockScroll = () => {
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

const bind = () => {
  if (typeof window === 'undefined') return
  window.addEventListener('keydown', onKeydown)
}

const unbind = () => {
  if (typeof window === 'undefined') return
  window.removeEventListener('keydown', onKeydown)
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      lockScroll()
      bind()
    } else {
      unlockScroll()
      unbind()
    }
  },
  { immediate: true },
)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnOutsideClick) close()
}

onBeforeUnmount(() => {
  unbind()
  if (props.modelValue) unlockScroll()
})
</script>

<style scoped>
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 8px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(5, 27, 42, 0.48);
  backdrop-filter: blur(7px) saturate(120%);
  -webkit-backdrop-filter: blur(7px) saturate(120%);
}

.modal-panel {
  position: relative;
  width: 100%;
  max-width: 100%;
  max-height: 90dvh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--mc-border);
  border-radius: 16px;
  box-shadow: 0 32px 90px -32px rgba(4, 29, 47, 0.55), 0 4px 18px -8px rgba(4, 29, 47, 0.16);
  overflow: hidden;
  transform-origin: bottom center;
}

.modal-grabber {
  display: flex;
  justify-content: center;
  padding: 9px 0 3px;
  flex-shrink: 0;
}
.modal-grabber span {
  width: 40px;
  height: 4px;
  border-radius: 99px;
  background: #dbe6ee;
}

.modal-head {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 18px 15px;
  border-bottom: 1px solid var(--mc-border);
}

.modal-head-copy {
  min-width: 0;
}
.modal-eyebrow {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--mc-brand);
  font-weight: 700;
  margin-bottom: 3px;
}
.modal-title {
  font-family: var(--mc-font-heading);
  font-size: 18px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--mc-ink);
  margin: 0;
}
.modal-description {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--mc-muted);
}

.modal-close {
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
.modal-close:hover {
  color: var(--mc-danger);
  background: var(--mc-danger-soft);
  border-color: #fecaca;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.modal-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 11px 18px calc(11px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--mc-border);
  background: #fbfdfe;
}
.modal-footer > :first-child:not(:last-child) {
  margin-right: auto;
}

/* Animations */
.modal-root-enter-active,
.modal-root-leave-active {
  transition: opacity 0.22s ease;
}
.modal-root-enter-from,
.modal-root-leave-to {
  opacity: 0;
}

.modal-panel-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}
.modal-panel-leave-active {
  transition: transform 0.2s cubic-bezier(0.4, 0, 1, 1), opacity 0.16s ease;
}
.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.99);
}

/* Desktop: a floating centred card. */
@media (min-width: 640px) {
  .modal-root {
    align-items: center;
    padding: 24px;
  }
  .modal-panel {
    max-height: min(88dvh, 900px);
    border-radius: 14px;
  }
  .modal-grabber {
    display: none;
  }
  .modal-head {
    padding: 16px 20px 13px;
  }
  .modal-title {
    font-size: 18px;
  }
  .modal-footer {
    padding: 11px 20px;
  }
  .modal-panel-enter-from,
  .modal-panel-leave-to {
    transform: translateY(10px) scale(0.985);
  }
}

/* Sizes */
.modal-sm {
  max-width: 420px;
}
.modal-md {
  max-width: 540px;
}
.modal-lg {
  max-width: 700px;
}
.modal-xl {
  max-width: 900px;
}
.modal-2xl {
  max-width: 1080px;
}
.modal-full {
  max-width: 1220px;
}

@media (max-width: 639px) {
  .modal-footer {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  }
  .modal-footer > * {
    flex: 1 1 auto;
    min-width: 0;
    width: auto;
  }
}
</style>
