<template>
  <Teleport to="body">
    <Transition name="sheet-root">
      <div v-if="modelValue" class="sheet-root" role="dialog" aria-modal="true" :aria-label="title">
        <div class="sheet-backdrop" @click="close"></div>

        <Transition name="sheet-panel" appear>
          <section
            v-if="modelValue"
            :class="['sheet-panel', sizeClass]"
            @click.stop
          >
            <div class="sheet-grabber" aria-hidden="true"><span></span></div>

            <header class="sheet-head">
              <div class="sheet-head-copy">
                <p v-if="eyebrow" class="sheet-eyebrow">{{ eyebrow }}</p>
                <h2 class="sheet-title">{{ title }}</h2>
                <p v-if="description" class="sheet-description">{{ description }}</p>
              </div>
              <button class="sheet-close" type="button" aria-label="Close panel" @click="close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-4 h-4">
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
  }>(),
  {
    eyebrow: '',
    description: '',
    size: 'lg',
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
  background: rgba(6, 31, 48, 0.44);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.sheet-panel {
  position: relative;
  width: 100%;
  max-height: 92dvh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--mc-border);
  border-bottom: 0;
  border-radius: 24px 24px 0 0;
  box-shadow: var(--mc-shadow-lg);
  overflow: hidden;
  transform-origin: bottom center;
}

.sheet-grabber {
  display: flex;
  justify-content: center;
  padding: 8px 0 2px;
  flex-shrink: 0;
}
.sheet-grabber span {
  width: 42px;
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
  padding: 12px 20px 14px;
  border-bottom: 1px solid var(--mc-border);
}
.sheet-head-copy {
  min-width: 0;
}
.sheet-eyebrow {
  font-family: var(--mc-font-heading);
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mc-brand);
  font-weight: 700;
  margin-bottom: 3px;
}
.sheet-title {
  font-family: var(--mc-font-heading);
  font-size: 19px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--mc-ink);
  margin: 0;
}
.sheet-description {
  margin-top: 4px;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--mc-muted);
}
.sheet-close {
  width: 34px;
  height: 34px;
  border-radius: 10px;
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
  padding: 18px 20px 24px;
  -webkit-overflow-scrolling: touch;
}

.sheet-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px calc(14px + env(safe-area-inset-bottom));
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
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
}
.sheet-panel-leave-active {
  transition: transform 0.22s cubic-bezier(0.4, 0, 1, 1), opacity 0.18s ease;
}
.sheet-panel-enter-from,
.sheet-panel-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media (min-width: 768px) {
  .sheet-root {
    align-items: stretch;
  }
  .sheet-panel {
    height: 100%;
    max-height: none;
    border-radius: 0;
    border: 0;
    border-left: 1px solid var(--mc-border);
    box-shadow: -24px 0 70px -30px rgba(16, 42, 58, 0.3);
    transform-origin: right center;
  }
  .sheet-grabber {
    display: none;
  }
  .sheet-head {
    padding: 22px 24px 18px;
  }
  .sheet-title {
    font-size: 21px;
  }
  .sheet-body {
    padding: 22px 24px 32px;
  }
  .sheet-footer {
    padding: 16px 24px;
  }
  .sheet-panel-enter-from,
  .sheet-panel-leave-to {
    opacity: 1;
    transform: translateX(100%);
  }
}

.sheet-sm {
  max-width: 430px;
}
.sheet-md {
  max-width: 540px;
}
.sheet-lg {
  max-width: 680px;
}
.sheet-xl {
  max-width: 880px;
}
.sheet-full {
  max-width: 100%;
}

@media (min-width: 1024px) {
  .sheet-full {
    max-width: min(92vw, 1200px);
  }
}
</style>
